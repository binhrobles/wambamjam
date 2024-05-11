const [note_range, mapping_notes] = await Promise.all([
    fetch("data/note_range.json").then(res => res.json()),
    fetch("data/mapping_notes.json").then(res => res.json())
]);

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

window.change_heights = (buildingData) => {
  const heights = buildingData.map(b => b.height);

  if (!loop || buildingData.length == 0) {
    return;
  }
  notes = map_heights_to_notes(heights)
  const bpm = findBPM(heights)

  console.log(bpm)
  Tone.Transport.bpm.value = bpm
}

window.toggleSound = () => {
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

function map_heights_to_notes(heights) {
  const final_notes = heights.map(height => {
    let diffArr = mapping_notes.map(x => Math.abs(height - x));
    let minNumber = diffArr.reduce((a, b) => Math.min(a, b), +Infinity);
    let index = diffArr.findIndex(x => x === minNumber);
    console.log(note_range[index], mapping_notes[index], height)
    return note_range[index]
    //synth.triggerAttackRelease(notes[index], "8n");
  });
  console.log(final_notes)
  return final_notes
}

function findBPM(heights) {
  const sortedHeights = heights.toSorted();
  return median(sortedHeights.slice(-5)) * 4
}
