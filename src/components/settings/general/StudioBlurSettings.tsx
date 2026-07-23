import { For, createSignal } from 'solid-js';
import { useSettings } from '../../../contexts/useSettings';
import { StudioBlurService } from '../../../service/StudioBlurService';

const StudioBlurSettings = () => {
  const { store, setStore } = useSettings();
  const [newStudio, setNewStudio] = createSignal('');

  const saveStudios = (studios: string[]) => {
    setStore('blurStudios', StudioBlurService.normalizeStudios(studios));
  };

  const addStudio = () => {
    const studio = newStudio().trim();
    if (!studio) return;
    saveStudios([...store.blurStudios, studio]);
    setNewStudio('');
  };

  return (
    <section class="mt-4">
      <h5>Blurred Studios</h5>
      <p class="text-muted small">
        Studios in this list have their scene-card images blurred on StashDB.
      </p>
      <div class="input-group input-group-sm mb-3">
        <input
          class="form-control"
          type="text"
          value={newStudio()}
          placeholder="Studio name"
          aria-label="Studio name to blur"
          onInput={(event) => setNewStudio(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addStudio();
            }
          }}
        />
        <button class="btn btn-primary" type="button" onClick={addStudio}>
          Add studio
        </button>
      </div>
      <div class="d-flex flex-column gap-2 mb-3">
        <For each={store.blurStudios}>
          {(studio, index) => (
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="text"
                value={studio}
                aria-label="Blurred studio name"
                onInput={(event) => {
                  const next = [...store.blurStudios];
                  next[index()] = event.currentTarget.value;
                  saveStudios(next);
                }}
              />
              <button
                class="btn btn-outline-danger"
                type="button"
                onClick={() =>
                  saveStudios(
                    store.blurStudios.filter((_, itemIndex) => itemIndex !== index()),
                  )
                }
              >
                Remove
              </button>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};

export default StudioBlurSettings;
