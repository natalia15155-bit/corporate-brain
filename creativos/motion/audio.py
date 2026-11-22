#!/usr/bin/env python3
"""Agrega voz sintética y música ambiental original a los videos de creativos/piezas.
Uso: python3 audio.py <A1|B1|B2|B3> <video_sin_audio.mp4> <salida.mp4> <modelo.onnx>
Requiere piper-tts (venv aparte), numpy y ffmpeg. No usa créditos ni material de terceros.
LICENCIA DE LA VOZ: es_AR-daniela-high es CC BY-SA 4.0 (OpenSLR 61): revisar antes de usarla en anuncios pagos.
"""
import sys, wave, subprocess, tempfile, os
import numpy as np
from piper import PiperVoice, SynthesisConfig

SR = 44100
LINES = {  # (inicio, fin_de_ventana, texto)
 "A1": [(0.2, 3.0, "¿Se te hundió la vela?"), (3.2, 5.5, "¿Se agrietó?"), (5.7, 8.0, "¿O no tiene aroma al encenderla?"),
        (8.3, 16.0, "Este curso empieza desde cero. Qué materiales comprar, los términos básicos y tu primera vela, paso a paso."),
        (16.3, 22.0, "Son tres cursos: velas, velas navideñas y jabones. Y tenés seis meses para consultar tus dudas."),
        (22.3, 25.1, "Mirá qué incluye en el enlace.")],
 "B1": [(0.2, 3.2, "Cinco cosas que le pasan a tu vela. Y cómo se llaman."), (3.4, 6.1, "Uno. Hundimiento."), (6.4, 9.1, "Dos. Grietas."),
        (9.4, 12.1, "Tres. Sudor."), (12.4, 15.1, "Cuatro. Manchas."), (15.4, 18.1, "Cinco. Falta de aroma."),
        (18.4, 22.3, "El curso tiene un módulo entero para esto. Mirá el temario.")],
 "B2": [(0.2, 4.1, "¿Cuánto cuesta de verdad hacer una sola vela?"),
        (4.6, 16.9, "Ejemplo con números inventados. Sumás la cera, el pabilo, el frasco y el aroma."),
        (20.4, 24.1, "Recién ahí sabés cuánto cobrar."), (24.4, 28.1, "Módulo veintidós: cuánto cobrar. Mirá el módulo.")],
 "B3": [(0.5, 5.8, "Videos sueltos o un curso en orden. Partes sueltas, prueba y error, y buscar proveedores por tu cuenta."),
        (6.2, 11.0, "Veintidós módulos en orden: de la teoría a la venta, un módulo entero de errores y lista de proveedores por país."),
        (11.3, 14.0, "Mirá los veintidós módulos.")],
}
MUSIC = {"A1": ("menor", 72), "B1": ("mayor", 84), "B2": ("mayor", 84), "B3": ("mayor", 84)}

def note(m): return 440.0 * 2 ** ((m - 69) / 12)

def music(dur, modo, bpm):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    prog = ([57, 53, 48, 55] if modo == "menor" else [48, 55, 57, 53])   # raíces (A F C G) o (C G A F)
    tri = {"menor": [0, 3, 7, 12], "mayor": [0, 4, 7, 12]}
    beat = 60.0 / bpm; bar = 4 * beat
    for i in range(int(dur / bar) + 2):
        root = prog[i % 4]; third = tri["menor" if (modo == "menor" or i % 4 == 2) else "mayor"]
        s, e = i * bar, (i + 1) * bar + 0.8
        idx = (t >= s) & (t < e)
        if not idx.any(): continue
        tt = t[idx] - s; env = np.minimum(1, tt / 0.9) * np.minimum(1, (e - t[idx]) / 0.9)
        pad = np.zeros_like(tt)
        for k, off in enumerate(third):
            f = note(root + off - 12)
            for det in (-0.6, 0.6):
                pad += np.sin(2 * np.pi * (f + det) * tt) * (0.5 if k else 0.8) + 0.18 * np.sin(2 * np.pi * 2 * (f + det) * tt)
        out[idx] += pad * env * 0.11
        # arpegio suave (pluck)
        for j in range(8):
            ts = s + j * beat / 2
            if ts >= dur: break
            nt = note(root + third[(j * 2) % 4] + 12)
            m = (t >= ts) & (t < ts + 1.4); tt2 = t[m] - ts
            out[m] += np.sin(2 * np.pi * nt * tt2) * np.exp(-tt2 * 4.2) * 0.07 + 0.02 * np.sin(2 * np.pi * 2 * nt * tt2) * np.exp(-tt2 * 7)
    out *= np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 1.2)
    return out / (np.abs(out).max() + 1e-9)

def voz(name, model, dur):
    v = PiperVoice.load(model); track = np.zeros(int(dur * SR)); report = []
    for s, e, txt in LINES[name]:
        ls = 1.0
        for _ in range(12):
            tmp = tempfile.mktemp(suffix=".wav")
            with wave.open(tmp, "wb") as wf: v.synthesize_wav(txt, wf, syn_config=SynthesisConfig(length_scale=ls))
            w = wave.open(tmp); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype("float32") / 32768; sr = w.getframerate(); w.close(); os.remove(tmp)
            d = len(a) / sr
            if s + d <= e or ls <= 0.80: break
            ls = max(0.80, ls * (e - s) / d * 0.98)
        a = np.interp(np.arange(int(len(a) * SR / sr)) / SR * sr, np.arange(len(a)), a)
        i0 = int(s * SR); track[i0:i0 + len(a)] += a[:len(track) - i0]
        report.append((s, round(len(a) / SR, 2), round(e - s, 2), round(ls, 2), "EXCEDE" if s + len(a) / SR > e + 0.05 else "ok", txt[:40]))
    return track, report

def main(name, vin, vout, model):
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vin]))
    vt, rep = voz(name, model, dur)
    for r in rep: print(r)
    modo, bpm = MUSIC[name]; mu = music(dur, modo, bpm)
    env = np.convolve(np.abs(vt), np.ones(int(0.15 * SR)) / int(0.15 * SR), mode="same"); env = np.clip(env / (env.max() + 1e-9) * 4, 0, 1)
    mix = vt / (np.abs(vt).max() + 1e-9) * 0.9 + mu * 0.30 * (1 - 0.6 * env)
    mix = mix / (np.abs(mix).max() + 1e-9) * 0.89
    wav = tempfile.mktemp(suffix=".wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", vin, "-i", wav, "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", vout])
    os.remove(wav); print("listo", vout)

if __name__ == "__main__":
    main(*sys.argv[1:5])
