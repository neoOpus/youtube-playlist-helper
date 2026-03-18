import type { Component } from 'svelte';

export interface IconProps {
    size?: string | number;
    color?: string;
}

export type IconComponent = Component<IconProps>;
