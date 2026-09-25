import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = {
    pastes: localStorage.getItem('pastes')
        ? JSON.parse(localStorage.getItem('pastes'))
        : []
}

export const pasteSlice = createSlice({
    name: 'paste',
    initialState,
    reducers: {
        addToPastes: (state, action) => {
            const pastes = action.payload;
            state.pastes.push(pastes);
            localStorage.setItem('pastes', JSON.stringify(state.pastes));

            toast.success('Paste created successfully!');
        },

        updateToPastes: (state, action) => {
            const paste = action.payload;
            const index = state.pastes.findIndex((item) => item._id === paste._id);

            if (index >= 0) {
                state.pastes[index] = paste;
                localStorage.setItem('pastes', JSON.stringify(state.pastes));
                toast.success('Paste updated successfully!');
            }
        },

        toggleFavorite: (state, action) => {
            const paste = state.pastes.find((item) => item._id === action.payload);

            if (paste) {
                paste.favorite = !paste.favorite;
                localStorage.setItem('pastes', JSON.stringify(state.pastes));
            }
        },

        importPastes: (state, action) => {
            state.pastes = action.payload;
            localStorage.setItem('pastes', JSON.stringify(state.pastes));
            toast.success('Pastes imported successfully.');
        },

        resetAllPastes: (state) => {
            state.pastes = [];
            localStorage.removeItem('pastes');
        },

        removeFromPasts: (state, action) => {
            const pasteId = action.payload;

            const index = state.pastes.findIndex((item) => item._id === pasteId);

            if (index >= 0) {
                state.pastes.splice(index, 1);
                localStorage.setItem('pastes', JSON.stringify(state.pastes));
                toast.success('Paste deleted successfully!');
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    addToPastes,
    updateToPastes,
    toggleFavorite,
    importPastes,
    resetAllPastes,
    removeFromPasts,
} = pasteSlice.actions

export default pasteSlice.reducer