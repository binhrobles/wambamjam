import * as Tone from "tone";

const buildMapping = (notes, high_note, low_note) => {
  const step = (high_note - low_note) / (notes.length)

  var mapping_notes = Array(notes.length);
  for (var i = 0; i < notes.length; i++) {
    mapping_notes[i] = low_note + i * step
  }
  return mapping_notes
}

const play_synth = (heights) => {
  //const heights = [10.5, 18.0, 9.0, 3.3, 4.1, 7.5, 9.2, 62.5, 17.8, 10.6, 7.7, 57.5, 19.3, 7.2]
  const synth = new Tone.Synth().toDestination();

  const max_height = Math.max(...heights)
  console.log(max_height)
  const norm_heights = heights.map(function(height) { return height / max_height })

  console.log(norm_heights)
  const avg_norm_height = norm_heights.reduce((a, b) => a + b) / norm_heights.length;
  console.log(max_height)
  console.log(avg_norm_height)

  const min_norm_height = Math.min(...norm_heights)
  console.log(min_norm_height)

  const low_notes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"]
  const mapping_low_notes = buildMapping(low_notes, avg_norm_height, min_norm_height)

  const high_notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"]
  const mapping_high_notes = buildMapping(high_notes, 1, avg_norm_height)

  const notes = low_notes.concat(high_notes).concat(["C5"])
  const mapping_notes = mapping_low_notes.concat(mapping_high_notes).concat(1.0)
  console.log(notes)
  console.log(mapping_notes)

  norm_heights.forEach(norm_height => {
    let diffArr = mapping_notes.map(x => Math.abs(norm_height - x));
    let minNumber = Math.min(...diffArr);
    let index = diffArr.findIndex(x => x === minNumber);
    console.log(notes[index], mapping_notes[index], norm_height)
    synth.triggerAttackRelease(notes[index], "8n");
  });
}
