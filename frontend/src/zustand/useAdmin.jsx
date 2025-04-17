import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdmin=create(persist(
    (set,get)=>{
        
    }
))