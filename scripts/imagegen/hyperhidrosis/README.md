# Hyperhidrosis Ailment Image Generation

This folder contains one `generate-batch` JSONL file per ailment page.
Each file defines 4 outputs:
- 1 mechanism/hero image (`1536x1024`, png)
- 3 process-step images (`1024x1024`, jpg)

## Prerequisites
- `OPENAI_API_KEY` must be valid in your shell.
- Use the bundled skill CLI at `~/.codex/skills/imagegen/scripts/image_gen.py`.

## Generate one ailment set

```bash
export IMAGE_GEN="$HOME/.codex/skills/imagegen/scripts/image_gen.py"

python "$IMAGE_GEN" generate-batch \
  --input scripts/imagegen/hyperhidrosis/back-hyperhidrosis.jsonl \
  --out-dir output/imagegen/hyperhidrosis/back-hyperhidrosis \
  --concurrency 2 \
  --max-attempts 3 \
  --force
```

Replace `back-hyperhidrosis.jsonl` and `back-hyperhidrosis` with the ailment slug you want.

## Promote outputs to the site assets

```bash
cp output/imagegen/hyperhidrosis/back-hyperhidrosis/* public/procedure/hyperhidrosis/
```

Then update the corresponding MDX file in `src/markdown/ailments/hyperhidrosis-treatment/` to point to:
- `/procedure/hyperhidrosis/<slug>-mechanism.png`
- `/procedure/hyperhidrosis/<slug>-step-1.jpg`
- `/procedure/hyperhidrosis/<slug>-step-2.jpg`
- `/procedure/hyperhidrosis/<slug>-step-3.jpg`
```

## Remaining ailment files
- `back-hyperhidrosis.jsonl`
- `facial-sweating.jsonl`
- `groin-hyperhidrosis.jsonl`
- `scalp-hyperhidrosis.jsonl`
- `sweaty-feet.jsonl`
- `sweaty-palms.jsonl`
