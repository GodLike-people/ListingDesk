from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path

import yaml


@dataclass(slots=True)
class Config:
    vault_path: Path
    notes_root: str = "Flomo"
    attachment_root: str = "Flomo/_attachments"
    import_dir: str = "imports"
    download_dir: str = "downloads"
    browser_profile_dir: str = ".browser-profile"
    flomo_login_url: str = "https://v.flomoapp.com/login"
    flomo_export_url: str = "https://v.flomoapp.com/mine?source=export"
    export_timeout_seconds: int = 300

    @classmethod
    def from_dict(cls, data: dict) -> "Config":
        if not data.get("vault_path"):
            raise ValueError("config.yaml is missing vault_path")
        payload = dict(data)
        payload["vault_path"] = Path(payload["vault_path"]).expanduser()
        if payload.get("flomo_export_url") in {"https://flomoapp.com/mine", "https://v.flomoapp.com/mine"}:
            payload["flomo_export_url"] = "https://v.flomoapp.com/mine?source=export"
        payload.setdefault("flomo_login_url", "https://v.flomoapp.com/login")
        return cls(**payload)

    def to_dict(self) -> dict:
        data = asdict(self)
        data["vault_path"] = str(self.vault_path)
        return data


def config_path(project_root: Path) -> Path:
    return project_root / "config.yaml"


def load_config(project_root: Path, interactive: bool = True) -> Config:
    path = config_path(project_root)
    if path.exists():
        with path.open("r", encoding="utf-8") as file:
            data = yaml.safe_load(file) or {}
        return Config.from_dict(data)
    if not interactive:
        raise FileNotFoundError(f"Missing config file: {path}")
    return prompt_config(project_root)


def prompt_config(project_root: Path) -> Config:
    print("First run setup")
    print("Please paste your Obsidian vault path, for example: D:\\Notes\\MyVault")
    while True:
        raw = input("Obsidian vault path: ").strip().strip('"')
        if not raw:
            print("Vault path is required.")
            continue
        vault_path = Path(raw).expanduser()
        if not vault_path.exists():
            create = input("Path does not exist. Create it? [y/N]: ").strip().lower()
            if create == "y":
                vault_path.mkdir(parents=True, exist_ok=True)
            else:
                continue
        config = Config(vault_path=vault_path)
        save_config(project_root, config)
        ensure_project_dirs(project_root, config)
        return config


def save_config(project_root: Path, config: Config) -> None:
    path = config_path(project_root)
    with path.open("w", encoding="utf-8") as file:
        yaml.safe_dump(config.to_dict(), file, allow_unicode=True, sort_keys=False)


def ensure_project_dirs(project_root: Path, config: Config) -> None:
    (project_root / config.import_dir).mkdir(parents=True, exist_ok=True)
    (project_root / config.download_dir).mkdir(parents=True, exist_ok=True)
    (project_root / "logs").mkdir(parents=True, exist_ok=True)
