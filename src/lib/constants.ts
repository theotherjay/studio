// Viewport dimensions (initial)
export const INITIAL_VIEWPORT_WIDTH = 800;
export const INITIAL_VIEWPORT_HEIGHT = 600;

// Player
export const PLAYER_SIZE_FACTOR = 50; // Player size is 1/50th of viewport
export const PLAYER_SPEED = 4; // Pixels per frame/update
export const PLAYER_SPEED = 15; // Pixels per second

// World
export const WORLD_SCALE_FACTOR = 10; // World is 10x viewport size

// Trees
export const NUMBER_OF_TREES = 150;
export const TREE_BASE_WIDTH = INITIAL_VIEWPORT_WIDTH / 40; // Approx. slightly larger than player
export const TREE_BASE_HEIGHT = INITIAL_VIEWPORT_HEIGHT / 25; // Approx. slightly larger than player
export const TREE_SIZE_VARIATION = 0.3; // +/- 30% variation in size

// Parallax
export const PARALLAX_BACKGROUND_SCALE = 1.5; // How much larger the parallax bg is than the world
export const PARALLAX_SPEED_FACTOR = 0.3; // How much slower the parallax bg moves
