from __future__ import annotations

import argparse
from pathlib import Path

from .config import Config, ensure_project_dirs, load_config, prompt_config, save_config
from .state import SyncState
from .sync import SyncEngine


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Sync flomo HTML/ZIP exports into Obsidian.")
    subparsers = parser.add_subparsers(dest="command")

    configure = subparsers.add_parser("configure", help="Create or update config.yaml.")
    configure.add_argument("--vault", type=Path, help="Obsidian vault path.")

    sync = subparsers.add_parser("sync", help="Sync flomo exports.")
    sync.add_argument("--auto-download", action="store_true", help="Open browser and try official flomo export.")
    sync.add_argument("--no-auto-download", action="store_true", help="Only process ZIP files in imports.")
    sync.add_argument("--zip", type=Path, help="Process a specific flomo ZIP export.")
    sync.add_argument("--force", action="store_true", help="Reprocess archives already seen in state.json.")

    args = parser.parse_args(argv)
    project_root = Path.cwd()

    if args.command == "configure":
        if args.vault:
            config = load_config(project_root, interactive=False) if (project_root / "config.yaml").exists() else Config(vault_path=args.vault)
            config.vault_path = args.vault
            save_config(project_root, config)
            ensure_project_dirs(project_root, config)
            print(f"Config saved: {project_root / 'config.yaml'}")
            return 0
        prompt_config(project_root)
        print(f"Config saved: {project_root / 'config.yaml'}")
        return 0

    if args.command in {None, "sync"}:
        config = load_config(project_root, interactive=True)
        ensure_project_dirs(project_root, config)
        state = SyncState.load(project_root)
        auto_download = getattr(args, "auto_download", False) or not getattr(args, "no_auto_download", False)
        zip_path = getattr(args, "zip", None)
        force = getattr(args, "force", False)
        engine = SyncEngine(project_root, config, state)
        summary = engine.sync(auto_download=auto_download, zip_path=zip_path, force=force)
        print("")
        print("Sync summary")
        print(f"  Archives processed: {summary.archives}")
        print(f"  Duplicate archives skipped: {summary.duplicate_archives}")
        print(f"  Memos parsed: {summary.memo_count}")
        print(f"  Created: {summary.created}")
        print(f"  Updated: {summary.updated}")
        print(f"  Unchanged: {summary.skipped}")
        print(f"  Failed: {summary.failed}")
        return 1 if summary.failed else 0

    parser.print_help()
    return 1
