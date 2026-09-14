# Škoda Storyboard — Documentation Map

Analysis, planning, and delivery docs for the Škoda Storyboard → AEM Edge Delivery migration.
Organized into topic subfolders on 2026-09-14 (previously a flat `docs/`). All `.md` here is
`.hlxignore`'d — these documents are **not served** by EDS; they are project knowledge only.

**Start here:** [`analysis/SKODA-MASTER.md`](analysis/SKODA-MASTER.md) is the canonical findings doc;
its §16 Document Map indexes every source report with its current path.

## Folders

| Folder | What's in it |
|---|---|
| **`analysis/`** | Canonical findings (`SKODA-MASTER.md` + coverage proof) and the source analysis reports behind them — block/widget inventories + datasets, complex-systems deep-dive, flattener POC, header/footer analysis, discovery & drilldown. |
| **`architecture/`** | Target-state build & architecture specs (`SKODA-EDS-DA-ARCHITECTURE.md`, `SKODA-SYSTEM-BUILD-SPECS.md`). |
| **`media/`** | Media pipeline, media-cart/download feasibility, asset mapping, media deep-dive & integration review. |
| **`planning/`** | Delivery plan (milestones + decision log), M1 demo target, client-requirements mapping, filterable requirements report (HTML), agent-handoff candidates, feasibility, discovery-session agenda, call-prep. |
| **`reviews/`** | Adversarial reviews, correctness audit, block-implementation review, deck-verification log. |
| **`source/`** | Original client input — the Media Room Migration requirements PDF. |
| **`archive/`** | **Superseded material, retained as reference** (not deleted). Prior consolidated overviews and the earlier exec briefing — succeeded by `analysis/SKODA-MASTER.md`. |
| **`tickets/`** | Delivery backlog — `OVERVIEW.md`, epics, and SKODA-* tickets. |
| **`deck/`** | Project-tracker slide deck + its build script. |
| **`meetings/`** | Meeting notes. |

## Conventions
- **Nothing is deleted.** Obsolete docs move to `archive/` with a banner pointing to their successor, so newer docs stay uncluttered while history remains a reference point.
- Cross-doc references use the doc's **filename** (unique across the corpus); resolve paths via this map or `SKODA-MASTER.md` §16.
- When adding a doc, drop it in the matching topic folder and, if it's a source report, add a row to `SKODA-MASTER.md` §16.
