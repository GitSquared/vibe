import type { ProcessorAudioComponentProps } from './types'
import { useState, useContext, useCallback, useEffect } from 'react'
import { AudioReactContext } from './audio-context'

interface PassFilterProps extends ProcessorAudioComponentProps {
	type: 'lowpass' | 'highpass' | 'bandpass'
	freq: number
	peak: number
}

interface ShelfFilterProps extends ProcessorAudioComponentProps {
	type: 'lowshelf' | 'highshelf'
	freq: number
	gain: number
}

interface PeakFilterProps extends ProcessorAudioComponentProps {
	type: 'peaking'
	freq: number
	width: number
	gain: number
}

interface ExcludeFilterProps extends ProcessorAudioComponentProps {
	type: 'notch' | 'allpass'
	freq: number
	width: number
}

type FilterProps = PassFilterProps | ShelfFilterProps | PeakFilterProps | ExcludeFilterProps

export default function Filter(props: FilterProps) {
	const [fltr, setFltr] = useState<BiquadFilterNode | null>(null)

	const ctx = useContext(AudioReactContext)

	const { type, freq, in: pIn, out: pOut, onNodeSpawn } = props
	const { peak } = props as PassFilterProps
	const { width } = props as ExcludeFilterProps
	const { gain } = props as ShelfFilterProps

	const callNodeSpawn = useCallback((node: AudioNode) => {
		if (typeof onNodeSpawn === 'function') onNodeSpawn(node)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		if (!ctx) return

		const filter = ctx.createBiquadFilter()
		filter.type = type

		setFltr(filter)
		callNodeSpawn(filter)
	}, [type, ctx, callNodeSpawn])

	useEffect(() => {
		if (!fltr || !pIn) return

		pIn.connect(fltr)
		return () => {
			pIn.disconnect(fltr)
		}
	}, [fltr, pIn])

	useEffect(() => {
		if (!fltr || !pOut) return

		fltr.connect(pOut)
		return () => {
			fltr.disconnect()
		}
	}, [fltr, pOut])

	useEffect(() => {
		if (!fltr || !ctx) return

		fltr.frequency.setValueAtTime(freq, ctx.currentTime)
	}, [fltr, ctx, freq])

	useEffect(() => {
		if (!fltr || !ctx || (!peak && !width)) return

		const Q = peak ?? width

		fltr.Q.setValueAtTime(Q, ctx.currentTime)
	}, [fltr, ctx, peak, width])

	useEffect(() => {
		if (!fltr || !ctx || !gain) return

		fltr.gain.setValueAtTime(gain, ctx.currentTime)
	}, [fltr, ctx, gain])

	return <></>
}
