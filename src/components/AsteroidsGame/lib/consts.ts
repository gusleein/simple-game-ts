export const AUDIO_SHOOT = new Audio('./audio/shoot.wav')
export const AUDIO_DAMAGE = new Audio('./audio/damage')
export const AUDIO_DIE = new Audio('./audio/die')
export const AUDIO_HIT = new Audio('./audio/hit')
export const AUDIO_IMPULSE = new Audio('./audio/impulse')

export const PATHES = [
    [[0, -1], [0.5, 0.3], [-0.5, 0.3]], // ship
    [[0, -1], [0.5, 0.3], [-0.5, 0.3], [-0.2, 0.3], [0, 1], [0.2, 0.3], [-0.5, 0.3]], // ship + fire
    [[-1, -1], [1, -1], [1, 1], [-1, 1]], // bullet
    [[0, -0.7], [0.3, -1], [1, -0.3], [0.5, -0.1], [0.7, 0.5], [0.1, 0.9], [-0.7, 1], [-1, 0.7], [-0.8, -0.5], [-0.3, -1]],
    [[-0.4, -1], [0.5, -1], [1, -0.8], [1, 0.1], [0.5, 1], [0.01, 1], [0, 0.2], [-0.2, 1], [-0.8, 0.2], [-0.5, 0], [-1, -0.1]],
    [[-0.8, -1], [0.1, -1], [1, -0.4], [1, -0.2], [0.5, 0], [1, 0.2], [0.4, 1], [0, 0.6], [-0.5, 1], [-1, 0.2], [-1, -0.5], [-0.4, -0.5]]
];