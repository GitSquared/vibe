import { useState, useEffect } from 'react'
import Oscillator from './audio-nodes/oscillator'
import Knob from './knob'
import Keyboard from './keyboard'
import styles from './synth.module.scss'

/* Look there:
  *
  * https://reverb.com/news/synth-basics-101
  *
  * Todo:
  * - Multiple oscillators
  * - Filters
  * - ADSR envelope
  * - Change waveshapes
  * - Beat machine
*/

export default function Synth() {
	const [audioCtx] = useState(new AudioContext())

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

	const [gainNode] = useState(audioCtx.createGain())
	const [gain, setGain] = useState(0.8)

	useEffect(() => {
		gainNode.gain.setValueAtTime(gain, audioCtx.currentTime)
	}, [gain, audioCtx, gainNode])

	useEffect(() => {
		gainNode.connect(audioCtx.destination)

		return () => {
			audioCtx.close()
		}
	}, [audioCtx, gainNode])

	return <div className={styles.container}>
		<div>
			{/* Hidden wiring */}
			{playedFreqs.map((freq, i) => (
				<Oscillator ctx={audioCtx} connectTo={gainNode} freq={freq} freqMod={freqMod} key={i}/>
			))}
		</div>
		<div>
			{/* Knobs panel */}
			<Knob label="freq" value={freqMod} onChange={setFreqMod} min={-1} max={1} step={0.01}/>
			<Knob label="gain" value={gain} onChange={setGain} min={0} max={1} step={0.01}/>
		</div>
		<div>
			{/* Input panel */}
			<Keyboard onKeyPress={handleKeyboardPress}/>
		</div>
	</div>
}
