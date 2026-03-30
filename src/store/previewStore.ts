import { create } from 'zustand'

export type RequestState = 'idle' | 'running' | 'at-block' | 'done'

interface PreviewState {
  requestState: RequestState
  activeBlockId: string | null
  passedBlockIds: string[]
  selectedBlockId: string | null
  setRequestState: (state: RequestState) => void
  setActiveBlock: (id: string | null) => void
  markBlockPassed: (id: string) => void
  setSelectedBlock: (id: string | null) => void
  reset: () => void
}

export const usePreviewStore = create<PreviewState>((set) => ({
  requestState: 'idle',
  activeBlockId: null,
  passedBlockIds: [],
  selectedBlockId: null,

  setRequestState: (requestState) => set({ requestState }),

  setActiveBlock: (activeBlockId) => set({ activeBlockId }),

  markBlockPassed: (id) =>
    set((state) => ({
      passedBlockIds: [...state.passedBlockIds, id],
    })),

  setSelectedBlock: (selectedBlockId) => set({ selectedBlockId }),

  reset: () =>
    set({
      requestState: 'idle',
      activeBlockId: null,
      passedBlockIds: [],
    }),
}))
