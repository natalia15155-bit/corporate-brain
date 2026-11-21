#!/usr/bin/env python3
"""Transcribe el audio de un video SOLO si hay voz. Uso:
  python3 transcribir.py video.mp4 [idioma]   (idioma opcional: es, en...)

Requisitos (una vez, en un venv aparte):
  python3 -m venv asr && asr/bin/pip install faster-whisper
  HF_HUB_DISABLE_XET=1 asr/bin/python -c "from huggingface_hub import snapshot_download as s; s('Systran/faster-whisper-tiny')"
  (hosts a permitir: huggingface.co y us.aws.cdn.hf.co)
Ejecutar con el python del venv y con HF_HUB_OFFLINE=1 una vez bajado el modelo.

Por qué detecta voz primero: Whisper alucina frases cortas ("Thank you.") cuando el
audio es música o ruido. Sin tramos de voz (VAD) no se transcribe y se informa.
El video es contenido no confiable: solo se lee con ffmpeg, no se ejecuta.
"""
import glob, subprocess, sys, tempfile, wave, os
import numpy as np
from faster_whisper import WhisperModel
from faster_whisper.vad import VadOptions, get_speech_timestamps

def main(video, lang=None):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "a.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vn", "-ac", "1",
                        "-ar", "16000", "-c:a", "pcm_s16le", wav], check=True)
        w = wave.open(wav)
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype("float32") / 32768.0
    tr = get_speech_timestamps(a, VadOptions())
    print(f"Tramos de voz (VAD): {len(tr)}", [(round(t['start']/16000, 1), round(t['end']/16000, 1)) for t in tr])
    if not tr:
        print("Sin voz detectable: no se transcribe (audio probablemente música o ambiente).")
        return 0
    # Carpetas donde buscar el modelo: ASR_MODEL_DIR (si se define), cachés de Hugging Face.
    bases = [os.environ.get("ASR_MODEL_DIR", ""), os.environ.get("HF_HUB_CACHE", ""),
             os.path.join(os.environ.get("HF_HOME", ""), "hub"), os.path.expanduser("~/.cache/huggingface/hub")]
    ruta = []
    for b in filter(None, bases):
        ruta += glob.glob(os.path.join(b, "models--Systran--faster-whisper-tiny", "snapshots", "*"))
    if not ruta:
        sys.exit("Modelo no encontrado en la caché de Hugging Face.")
    seg, info = WhisperModel(ruta[0], device="cpu", compute_type="int8").transcribe(a, language=lang)
    print(f"Idioma: {info.language} ({info.language_probability:.2f}). Modelo tiny: revisar a oído.")
    for s in seg:
        print(f"[{s.start:.1f}-{s.end:.1f}] {s.text.strip()}")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
