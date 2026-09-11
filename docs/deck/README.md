# Project development tracker deck

`skoda-storyboard-project-tracker.pptx` — a weekly progress deck for the
Škoda Storyboard → Edge Delivery Services migration.

- **One slide per week.** Each slide shows a single one-line progress headline.
- **Speaker notes** carry the detailed bullet talk-track (the week's summary).
- Škoda-branded (brand green `#0e3a2f`, SKODA-Next-style typography).

## Updating it each week

Everything is data-driven in `build_deck.py`. To add a week, append a dict to
the `WEEKS` list:

```python
{
    "week": "Week 3",
    "dates": "15–19 Sep 2026",
    "phase": "…short phase label…",
    "headline": "…the one-liner that highlights this week's progress…",
    "image": os.path.join(ASSETS, "week3-something.png"),  # optional
    "notes": [
        "Bullet 1 — detail for the talk track.",
        "Bullet 2 — …",
    ],
}
```

Put any slide images under `docs/deck/assets/`. Then regenerate:

```bash
python3 docs/deck/build_deck.py
```

(Requires `python-pptx`: `pip install --user python-pptx`.)

The script overwrites the `.pptx` from the `WEEKS` data, so the file always
reflects the source list — edit the data, not the binary.
