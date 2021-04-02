import type { GeneratorAudioComponentProps } from './types'
import { useState, useContext, useCallback, useEffect } from 'react'
import { AudioReactContext } from './audio-context'

const noteJumpConstant = 1.059463

interface OscillatorProps extends GeneratorAudioComponentProps {
	freq: number
	freqMod: number
	waveform: 'sine' | 'square' | 'sawtooth' | 'triangle' | PeriodicWave
}

export default function Oscillator(props: OscillatorProps) {
	const [osc, setOsc] = useState<OscillatorNode | null>(null)

	const ctx = useContext(AudioReactContext)

	const { out, onNodeSpawn, freq, freqMod, waveform } = props

	const callNodeSpawn = useCallback((node: AudioNode) => {
		if (typeof onNodeSpawn === 'function') onNodeSpawn(node)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		if (!ctx) return

		const osc = ctx.createOscillator()

		osc.start()

		setOsc(osc)
		callNodeSpawn(osc)

		return () => {
			osc.stop()
		}
	}, [ctx, callNodeSpawn])

	useEffect(() => {
		if (!osc || !out) return

		osc.connect(out)
		return () => {
			osc.disconnect()
		}
	}, [osc, out])

	useEffect(() => {
		if (!osc || !ctx) return

		let tmpFreq: number = freq
		let mod = Math.abs(freqMod)
		if (freqMod > 0) {
			tmpFreq = freq * (noteJumpConstant * mod + 1)
		} else {
			tmpFreq = freq / (noteJumpConstant * mod + 1)
		}

		osc.frequency.setValueAtTime(tmpFreq, ctx.currentTime)
	}, [osc, freq, freqMod, ctx])

	useEffect(() => {
		if (!osc) return

		if (waveform instanceof PeriodicWave) {
			osc.setPeriodicWave(waveform)
		} else {
			osc.type = waveform
		}
	}, [osc, waveform])

	return <></>
}
