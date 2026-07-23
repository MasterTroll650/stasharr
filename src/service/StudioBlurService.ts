import { icon } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import type { Config } from '../models/Config';

const BLUR_FILTER = 'blur(8px)';
const BUTTON_CLASS = 'stasharr-studio-blur-button';

export class StudioBlurService {
  static isBlurred(config: Config, studioName: string): boolean {
    const normalized = this.normalize(studioName);
    return config.blurStudios.some(
      (studio) => this.normalize(studio) === normalized,
    );
  }

  static toggle(config: Config, studioName: string): boolean {
    const normalized = this.normalize(studioName);
    const active = this.isBlurred(config, studioName);
    config.blurStudios = active
      ? config.blurStudios.filter((studio) => this.normalize(studio) !== normalized)
      : this.normalizeStudios([...config.blurStudios, studioName]);
    config.save();
    return !active;
  }

  static apply(config: Config, root: ParentNode = document): void {
    root.querySelectorAll<HTMLElement>('.SceneCard').forEach((card) => {
      const studioName = this.getStudioNameElement(card)?.textContent?.trim() ?? '';
      const shouldBlur = this.isBlurred(config, studioName);
      const targets = card.querySelectorAll<HTMLElement>('.SceneCard-image');
      const images = targets.length > 0 ? targets : card.querySelectorAll<HTMLElement>('img');
      images.forEach((target) => {
        target.style.filter = shouldBlur ? BLUR_FILTER : '';
      });
    });
  }

  static createButton(config: Config, studioName: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-sm ms-1 ${BUTTON_CLASS}`;
    button.dataset.stasharrStudioName = studioName;
    button.style.padding = '1px 5px';
    button.style.fontSize = '11px';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const name = button.dataset.stasharrStudioName;
      if (!name) return;
      this.toggle(config, name);
      this.updateButton(button, config, name);
      this.apply(config);
    });
    this.updateButton(button, config, studioName);
    return button;
  }

  static updateButton(
    button: HTMLButtonElement,
    config: Config,
    studioName: string,
  ): void {
    const active = this.isBlurred(config, studioName);
    const label = active
      ? 'Remove this studio from the blur list'
      : 'Add this studio to the blur list';
    button.replaceChildren(icon(active ? faEyeSlash : faEye).node[0]);
    button.title = label;
    button.setAttribute('aria-label', label);
    button.classList.toggle('btn-danger', active);
    button.classList.toggle('btn-secondary', !active);
  }

  static normalizeStudios(studios: string[]): string[] {
    return Array.from(
      new Map(
        studios
          .map((studio) => studio.trim())
          .filter(Boolean)
          .map((studio) => [this.normalize(studio), studio] as const),
      ).values(),
    );
  }

  static getStudioNameElement(card: HTMLElement): HTMLElement | null {
    return (
      card.querySelector<HTMLElement>('.SceneCard-studio-name') ??
      card.querySelector<HTMLAnchorElement>('a[href^="/studios/"]')
    );
  }

  private static normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
