import { Config } from '../models/Config';
import { extractStashIdFromPath } from '../util/util';
import { StashDB } from '../enums/StashDB';
import { render } from 'solid-js/web';
import Studio from '../components/Studio';
import { BaseController } from './BaseController';
import { StudioMutationHandler } from '../mutation-handlers/StudioMutationHandler';
import { StudioBlurService } from '../service/StudioBlurService';

export class StudioController extends BaseController {
  constructor(private _config: Config) {
    super(new StudioMutationHandler());
  }

  shouldReinit(node: HTMLElement): boolean {
    if (
      node.matches(StashDB.DOMSelector.StudioTitle) ||
      node.querySelector(StashDB.DOMSelector.StudioTitle)
    ) {
      return true;
    }
    return false;
  }

  initialize() {
    // Only initialize on studio pages
    if (!window.location.pathname.includes('/studios/')) {
      return;
    }

    const studioStashId = extractStashIdFromPath();
    const studioTitleH3: HTMLElement | null =
      document.querySelector<HTMLElement>(
        StashDB.DOMSelector.StudioTitle + ' > h3',
      );

    if (studioTitleH3) {
      const studioName = studioTitleH3.textContent?.trim();
      if (
        studioName &&
        !studioTitleH3.querySelector('.stasharr-studio-blur-button')
      ) {
        studioTitleH3.appendChild(
          StudioBlurService.createButton(this._config, studioName),
        );
      }

      if (this._config.whisparrApiKey !== '' && studioStashId !== null) {
        render(
          () => Studio({ config: this._config, stashId: studioStashId }),
          studioTitleH3,
        );
      }
    }
  }
}
