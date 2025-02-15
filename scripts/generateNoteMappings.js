// generates a mapping of heights to notes using the range of heights present in NYC
// generates mappings are made available in the `data` folder
// future: can generate mappings into set scales

import buildings from './heights.json' with { type: 'json' };
import fs from 'fs';

const buildMapping = (notes, high_note, low_note) => {
  const step = (high_note - low_note) / (notes.length)
  var mapping_notes = Array(notes.length);
  for (var i = 0; i < notes.length; i++) {
    mapping_notes[i] = low_note + i * step
  }
  return mapping_notes
}

const note_range = [
  // "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
  // "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
]

const heights = buildings.map(b => b[2]);
const max_height = heights.reduce((a, b) => {
  return Math.max(a, b);
}, -1);

note_range.push("C8");
const mapping_notes = buildMapping(note_range, max_height, 0.0).concat(max_height);

fs.writeFileSync('data/note_range.json', JSON.stringify(note_range));
fs.writeFileSync('data/mapping_notes.json', JSON.stringify(mapping_notes));
