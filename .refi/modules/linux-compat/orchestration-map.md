# Orchestration Map · REASP Linux Compatibility & MeridianUI Global Install

## Execution Order

```text
Phase 0 · Scaffolding
└── Este packet + rama git linux-compat + .MeridianUI/ placeholder en repo root.

Phase 1 · Audit & Gap Verification                     [Shard 01]
└── 01-gap-analysis.md
    └── Confirmar gap matrix. Auditar MeridianUI references en todo el codebase.
        Verificar qué archivos actuales leen/usan ~/.MeridianUI.

Phase 2 · Path Resolution (Bug Crítico)                [Shard 02]
└── 02-path-resolution.md
    └── Corregir file:/// bug con pathToFileURL.
        Verificar MeridianUI glob paths en Linux.

Phase 3 · OpenCode Binary Detection Linux              [Shard 03]
└── 03-opencode-detection.md
    └── Agregar linuxPaths[] JUNTO A winPaths[] (aditivo, no reemplazo).
        npm root -g helper. NVM/Volta paths.
        Completar detect.js para todos los agentes en Linux.

Phase 4 · OpenCode Adapter Full Consolidation          [Shard 04]
└── 04-opencode-adapter.md
    └── Auditoría completa línea por línea de opencode.js.
        Consolidar fixes de Shards 02+03 en commit atómico.
        Verificar que todos los paths de opencode.json son POSIX en Linux.

Phase 5 · MeridianUI Global Installer                  [Shard 09]  ← NUEVO
└── 09-meridianui-installer.md
    └── Crear installer/lib/meridianui.js con installMeridianUI().
        Integrar como paso pre-install en installer/index.js.
        Soportar Windows y Linux en el mismo código.
        Crear .MeridianUI/ placeholder en repo root.

Phase 6 · Minor Adapters Audit                         [Shard 05]
└── 05-adapters-menores.md
    └── Verificar claude-code.js, gemini.js, codex.js, antigravity.js.
        Confirmar que todos referencian ~/.MeridianUI correctamente post-Shard 09.

Phase 7 · Entry Points & npm Global                    [Shard 06]
└── 06-entry-points.md
    └── Bit +x, .gitattributes, package.json prepare.

Phase 8 · Testing & Validation                         [Shard 07]
└── 07-testing.md
    └── Gates de verification en Linux real.
        Tests de MeridianUI install en ambas plataformas.

Phase 9 · Documentation                                [Shard 08]
└── 08-documentation.md
    └── README: sección Linux + sección MeridianUI.
        AGENTS.md: paths Linux verificados.
        TROUBLESHOOTING.md: casos Linux + MeridianUI.
```

## Handoff al Implementador

1. Crear rama `linux-compat` desde `Master`.
2. Crear `.MeridianUI/.gitkeep` en repo root inmediatamente (placeholder para el usuario).
3. Ejecutar **Shard 01** (audit) — no tocar código hasta que el gap matrix esté confirmado.
4. Implementar **Shard 02** (pathToFileURL) — cambio más seguro, menor superficie.
5. Implementar **Shard 03** (linuxPaths — aditivo) — no modifica el bloque Windows.
6. Implementar **Shard 04** (consolidar opencode.js).
7. Implementar **Shard 09** (MeridianUI installer) — independiente, puede ir en paralelo con Shard 04.
8. Implementar **Shard 05** (minor adapters) — probablemente solo verificación.
9. Implementar **Shard 06** (entry points).
10. Ejecutar **Shard 07** (testing).
11. Cerrar con **Shard 08** (docs).

## Regla de Oro para Todo Cambio de Código

> Si el código existente funciona en Windows, **no se modifica**. Solo se agregan bloques nuevos en ramas `else` o arrays/condicionales adicionales. El reviewer debe poder ver claramente qué es código original (Windows) y qué es nuevo (Linux).

## Critical Path

```text
01 Audit → 02 pathToFileURL → 03 linuxPaths → 04 opencode.js consolidado → 07 Testing
                                     ↑
                              09 MeridianUI ────────────────────────────────┤
                              (independiente del critical path principal)
```

Shards 05 (adapters), 06 (entry points) y 08 (docs) van en paralelo tras Shard 04.

## Files to Create or Modify

### Archivos nuevos

```text
.MeridianUI/.gitkeep                           ← placeholder repo
.gitattributes                                  ← LF para scripts Unix
installer/lib/meridianui.js                     ← installMeridianUI() helper
```

### Archivos modificados

```text
package.json                                   (scripts.prepare para chmod)
installer/index.js                             (llamar installMeridianUI pre-install)
installer/lib/detect.js                        (rutas Linux)
installer/lib/targets/opencode.js              (linuxPaths[], pathToFileURL, meridianGlob)
installer/lib/targets/claude-code.js           (verificar/completar)
installer/lib/targets/gemini.js                (verificar/completar)
installer/lib/targets/codex.js                 (verificar/completar)
installer/lib/targets/antigravity.js           (verificar/completar)
README.md                                      (Linux + MeridianUI)
installer/AGENTS.md                            (paths Linux verificados)
installer/TROUBLESHOOTING.md                   (casos Linux + MeridianUI)
```

## Estimación de Complejidad

| Shard | Complejidad | Riesgo Regresión Windows |
|-------|-------------|--------------------------|
| 01 Audit | Baja (lectura) | Ninguno |
| 02 pathToFileURL | Baja | Muy bajo (mejora Windows también) |
| 03 linuxPaths | Media | Bajo (solo agrega código, no reemplaza) |
| 04 opencode.js audit | Media | Medio (archivo grande) |
| **09 MeridianUI** | **Media** | **Muy bajo (feature nueva)** |
| 05 Minor adapters | Baja | Muy bajo |
| 06 Entry points | Baja | Muy bajo |
| 07 Testing | N/A | — |
| 08 Documentation | Baja | Ninguno |
