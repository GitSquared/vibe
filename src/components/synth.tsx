import { useState } from 'react'
import AudioContext from './audio-nodes/audio-context'
import PatchBay from './audio-nodes/patchbay'
import Mixer from './audio-nodes/mixer'
import Oscillator from './audio-nodes/oscillator'
import Filter from './audio-nodes/filter'
import Gain from './audio-nodes/gain'
import Analyser from './audio-nodes/analyser'
import WaveformGraph from './waveform-graph'
import Knob from './knob'
import Keyboard from './keyboard'
import styles from './synth.module.scss'

/* Look there:
  *
  * https://reverb.com/news/synth-basics-101
  *
  * Todo:
  * - Multiple oscillators
  * - ADSR envelope
  * - Beat machine
*/

export default function Synth() {
	const [playedFreqs, setPlayedFreqs] = useState<number[]>([])

	function handleKeyboardPress(freq: number) {
		setPlayedFreqs(playedFreqs => [...playedFreqs, freq])

		return () => {
			setPlayedFreqs(playedFreqs => {
				const tmp = [...playedFreqs]
				tmp.splice(tmp.indexOf(freq), 1)
				return tmp
			})
		}
	}

	const [freqMod, setFreqMod] = useState(0)
	const [waveform, setWaveform] = useState(0)
	const waveforms = ['sine', 'square', 'sawtooth', 'triangle']

	const [hiPassCutoff, setHiPassCutoff] = useState(20)
	const [hiPassPeak, setHiPassPeak] = useState(0)
	const [loPassCutoff, setLoPassCutoff] = useState(20000)
	const [loPassPeak, setLoPassPeak] = useState(0)

	const [gain, setGain] = useState(0.8)

	const [waveformAnalyserNode, setWaveformAnalyserNode] = useState<AudioNode>()

	return <div className={styles.container}>
		<div style={{ display: 'none' }}>
			{/* Hidden wiring */}
			<AudioContext>
				<PatchBay>
					<Mixer>
						{playedFreqs.map((freq, i) => (
							<Oscillator key={i} freq={freq} freqMod={freqMod} waveform={waveforms[waveform]}/>
						))}
					</Mixer>
					<Filter type="highpass" freq={hiPassCutoff} peak={hiPassPeak}/>
					<Filter type="lowpass" freq={loPassCutoff} peak={loPassPeak}/>
					<Gain value={gain}/>
					<Analyser onNodeSpawn={node => { setWaveformAnalyserNode(node) }}/>
				</PatchBay>
			</AudioContext>
		</div>
		<div>
			{/* Visualizations */}
			<WaveformGraph node={waveformAnalyserNode as AnalyserNode}/>
		</div>
		<div>
			{/* Knobs panel */}
			<Knob label="freq" value={freqMod} onChange={setFreqMod} min={-1} max={1} step={0.01}/>
			<Knob label="wave" value={waveform} onChange={setWaveform} min={0} max={3}/>
			<Knob label="cutoff" value={hiPassCutoff} onChange={setHiPassCutoff} min={20} max={20000} step={100}/>
			<Knob label="peak" value={hiPassPeak} onChange={setHiPassPeak} min={0} max={100}/>
			<Knob label="cutoff" value={loPassCutoff} onChange={setLoPassCutoff} min={20} max={20000} step={100}/>
			<Knob label="peak" value={loPassPeak} onChange={setLoPassPeak} min={0} max={100}/>
			<Knob label="gain" value={gain} onChange={setGain} min={0} max={1} step={0.01}/>
		</div>
		<div>
			{/* Input panel */}
			<Keyboard onKeyPress={handleKeyboardPress}/>
		</div>
	</div>
}
