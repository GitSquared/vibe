import type { GeneratorAudioComponentProps } from './types'
import { useState, useEffect } from 'react'

const noteJumpConstant = 1.059463

interface OscillatorProps extends GeneratorAudioComponentProps {
	freq: number
	freqMod: number
}

export default function Oscillator(props: OscillatorProps) {
	const [osc, setOsc] = useState<OscillatorNode | null>(null)

	useEffect(() => {
		const osc = props.ctx.createOscillator()
		const gain = props.ctx.createGain()

		gain.gain.setValueAtTime(1, props.ctx.currentTime)
		osc.connect(gain).connect(props.out)
		osc.start()

		setOsc(osc)

		return () => {
			gain.gain.setTargetAtTime(0, props.ctx.currentTime, 0.2)
			setTimeout(() => {
				osc.stop()
				osc.disconnect()
				gain.disconnect()
			}, 1000)
		}
	}, [props.out, props.ctx])

	useEffect(() => {
		if (osc === null) return

		let freq = props.freq
		let mod = Math.abs(props.freqMod)
		if (props.freqMod > 0) {
			freq = freq * (noteJumpConstant * mod + 1)
		} else {
			freq = freq / (noteJumpConstant * mod + 1)
		}

		osc.frequency.setValueAtTime(freq, props.ctx.currentTime)
	}, [osc, props.freq, props.freqMod, props.ctx])

	return <></>
}
