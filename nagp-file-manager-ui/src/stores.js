import { writable } from 'svelte/store'

export const FILE_STORE = writable(
  {
    "Root": ["root.txt", "index.html"],
    "Documents": ["file1.mp4"],
    "Downloads": ["index.html", "styles.css"]
  }
)
