window.isPlaying = false;
let loop = null;
let notes = [];
let i = 0;

function play_synth() {
  //array of heights to test
  //const heights = [10.5, 18.0, 9.0, 3.3, 4.1, 7.5, 9.2, 62.5, 17.8, 10.6, 7.7, 57.5, 19.3, 7.2, 22.4, 50.0, 30.0, 45.0, 15.0, 20.9, 20.9, 16.5, 25.0, 10.0, 37.0, 117.1, 32.0, 25.0, 320.0, 45.0, 29.0, 161.0, 13.4, 46.3, 10.0, 10.0, 8.0, 90.0, 9.0, 28.5, 18.8, 18.8, 18.8, 18.8, 39.8, 28.0, 4.5, 4.5, 12.0, 12.0, 12.0, 5.0, 23.0, 20.0, 24.0, 24.0, 24.0, 13.5, 14.5, 13.5, 10.3, 13.0, 44.0, 83.0, 72.0, 76.0, 60.0, 88.0, 15.2, 40.0, 140.0, 12.9, 22.9, 65.1, 65.0, 13.4, 83.5, 7.0, 61.9, 5.6, 12.0, 54.0, 20.0, 44.6, 35.9, 29.0, 26.1, 12.7, 9.6, 8.9, 9.0, 6.6]
  // const heights = [19.9,7.8,8.5,8.1,7.5,8.4,7.5,14.6,7.4,17.2,16.6,20.3,16.7,18.2,16.7,11.0,18.2,20.5]
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

function change_heights(heights) {
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
