#!/usr/bin/env python3
"""Audita el ledger de afirmaciones. Uso: python3 -I auditar.py ruta/ledger-afirmaciones.csv

Reglas del modelo:
  1. Toda afirmación lleva marca (Obs/Inf/Fuente), fuente, tipo de fuente y grado.
  2. Grado A: observado por nosotros o fuente oficial leída completa.
     B: fuente oficial o primaria vista solo vía resumen/prensa.
     C: proveedor o practicante con interés comercial.
     D: sin fuente.
  3. Nada pasa a 'confirmada_propia' si la marca es Fuente: requiere prueba con datos propios.
  4. Toda afirmación grado B/C/D necesita 'prueba_propia' (cómo validarla) salvo que sea Obs.
  5. Una afirmación 'refutada' no puede usarse en guiones.
Sale con código 1 si hay incumplimientos.
"""
import csv, sys, collections

MARCAS = {"Obs", "Inf", "Fuente"}
GRADOS = {"A", "B", "C", "D"}
ESTADOS = {"no_verificada", "en_prueba", "confirmada_propia", "refutada"}
TIPOS = {"oficial", "prensa", "proveedor", "practicante", "propio"}

def main(path):
    with open(path, encoding="utf-8", newline="") as f:
        filas = list(csv.DictReader(f))
    errores, ids = [], set()
    for r in filas:
        i = r["id"]
        if i in ids: errores.append(f"{i}: id repetido")
        ids.add(i)
        if r["marca"] not in MARCAS: errores.append(f"{i}: marca inválida")
        if r["grado"] not in GRADOS: errores.append(f"{i}: grado inválido")
        if r["estado"] not in ESTADOS: errores.append(f"{i}: estado inválido")
        if r["tipo_fuente"] not in TIPOS: errores.append(f"{i}: tipo de fuente inválido")
        if not r["fuente"].strip(): errores.append(f"{i}: sin fuente")
        if r["marca"] == "Fuente" and r["estado"] == "confirmada_propia":
            errores.append(f"{i}: dato de fuente marcado confirmado sin prueba propia")
        if r["grado"] in {"B", "C", "D"} and r["marca"] != "Obs" and r["prueba_propia"].strip() in {"", "-"}:
            errores.append(f"{i}: grado {r['grado']} sin prueba propia definida")
        if r["tipo_fuente"] == "proveedor" and r["grado"] in {"A", "B"}:
            errores.append(f"{i}: fuente de proveedor no puede ser grado A/B")
    print(f"Afirmaciones: {len(filas)}")
    print("Por grado :", dict(collections.Counter(r["grado"] for r in filas)))
    print("Por estado:", dict(collections.Counter(r["estado"] for r in filas)))
    pend = [r["id"] for r in filas if r["estado"] == "no_verificada"]
    print(f"Sin verificar ({len(pend)}):", ", ".join(pend))
    if errores:
        print("\nINCUMPLIMIENTOS:"); [print(" -", e) for e in errores]
        return 1
    print("\nOK: el ledger cumple las reglas.")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
