import { For, createSignal } from 'solid-js';
import { useSettings } from '../../../contexts/useSettings';
import { StudioBlurService } from '../../../service/StudioBlurService';

const StudioBlurSettings = () => {
  const { store, setStore } = useSettings();
  const [newStudio, setNewStudio] = createSignal('');
  const [importMessage, setImportMessage] = createSignal('');

  const saveStudios = (studios: string[]) => {
    setStore('blurStudios', StudioBlurService.normalizeStudios(studios));
  };

  const addStudio = () => {
    const studio = newStudio().trim();
    if (!studio) return;
    saveStudios([...store.blurStudios, studio]);
    setNewStudio('');
  };

  const exportStudios = () => {
    const content = JSON.stringify({ blurStudios: store.blurStudios }, null, 2);
    const url = URL.createObjectURL(
      new Blob([content], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stasharr-blur-studios.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importStudios = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const studios = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && 'blurStudios' in parsed
          ? parsed.blurStudios
          : undefined;
      if (!Array.isArray(studios) || !studios.every((studio) => typeof studio === 'string')) {
        throw new Error('Invalid blur studio list');
      }
      saveStudios(studios);
      setImportMessage(
        `${StudioBlurService.normalizeStudios(studios).length} studios imported. Save changes to keep them.`,
      );
    } catch (error) {
      console.error('Failed to import blur studios:', error);
      setImportMessage('Import failed. Select a valid blur studio JSON file.');
    }
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
        <button class="btn btn-primary text-white fw-semibold" type="button" onClick={addStudio}>
          Add studio
        </button>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
        <button class="btn btn-sm btn-primary text-white fw-semibold" type="button" onClick={exportStudios}>
          Export list
        </button>
        <label class="btn btn-sm btn-success text-white fw-semibold mb-0" style={{ cursor: 'pointer' }}>
          Import list
          <input
            class="d-none"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) void importStudios(file);
              event.currentTarget.value = '';
            }}
          />
        </label>
        <span class="small text-muted">{importMessage()}</span>
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
