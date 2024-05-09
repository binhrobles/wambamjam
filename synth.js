window.isPlaying = false;
let loop = null;
let notes = [];
let i = 0;

function play_synth() {
  const heights = [10, 20];

  notes = map_heights_to_notes(heights)
  const bpm = findBPM(heights)

  console.log(bpm)
  const synth = new Tone.Synth().toDestination();
  loop = new Tone.Loop((time) => {
    i = (i + 1) % notes.length;
    synth.triggerAttackRelease(notes[i], "8n", time);
    // subdivisions are given as subarrays
  }, "8n").start(0);
  Tone.Transport.bpm.value = bpm
}

function change_heights(buildingData) {
  const heights = buildingData.map(b => b.height);

  if (!loop || heights.length == 0) {
    return;
  }
  notes = map_heights_to_notes(heights)
  const bpm = findBPM(heights)
  console.log(bpm)
  Tone.Transport.bpm.value = bpm
}

function toggleSound() {
  if (window.isPlaying) {
    loop.stop();
    Tone.Transport.stop()
    window.isPlaying = false
  } else {
    play_synth();
    Tone.Transport.start()
    window.isPlaying = true;
  }
  window.control.update();
}

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const buildMapping = (notes, high_note, low_note) => {
  const step = (high_note - low_note) / (notes.length)
  var mapping_notes = Array(notes.length);
  for (var i = 0; i < notes.length; i++) {
    mapping_notes[i] = low_note + i * step
  }
  return mapping_notes
}

function map_heights_to_notes(heights) {
  const max_height = Math.max(...heights)
  const norm_heights = heights.map(function(height) { return height / max_height })

  const avg_norm_height = norm_heights.reduce((a, b) => a + b) / norm_heights.length;

  const min_norm_height = Math.min(...norm_heights)

  const low_notes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"]
  const mapping_low_notes = buildMapping(low_notes, avg_norm_height, min_norm_height)

  const high_notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"]
  const mapping_high_notes = buildMapping(high_notes, 1, avg_norm_height)

  const notes = low_notes.concat(high_notes).concat(["C5"])
  const mapping_notes = mapping_low_notes.concat(mapping_high_notes).concat(1.0)

  const final_notes = norm_heights.map(norm_height => {
    let diffArr = mapping_notes.map(x => Math.abs(norm_height - x));
    let minNumber = Math.min(...diffArr);
    let index = diffArr.findIndex(x => x === minNumber);
    console.log(notes[index], mapping_notes[index], norm_height)
    return notes[index]
    //synth.triggerAttackRelease(notes[index], "8n");
  });
  console.log(final_notes)
  return final_notes
}

function findBPM(heights) {
  const sortedHeights = heights.toSorted();
  return median(sortedHeights.slice(-5)) * 4
}
