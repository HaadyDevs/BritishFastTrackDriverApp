import { atom } from 'jotai';

export const emailAtom = atom<string>('');
export const driverIdAtom = atom<number | null>(null);