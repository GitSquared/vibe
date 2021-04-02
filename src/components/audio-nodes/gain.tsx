import type { ProcessorAudioComponentProps } from './types'
import { useState, useContext, useCallback, useEffect } from 'react'
import { AudioReactContext } from './audio-context'

interface GainProps extends ProcessorAudioComponentProps {
	value: number
}

export default function Gain(props: GainProps) {
	const [gainNode, setGainNode] = useState<GainNode | null>(null)

	const ctx = useContext(AudioReactContext)

	const { in: pIn, out: pOut, onNodeSpawn } = props

	const callNodeSpawn = useCallback((node: AudioNode) => {
		if (typeof onNodeSpawn === 'function') onNodeSpawn(node)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		if (!ctx) return

		const gain = ctx.createGain()

		setGainNode(gain)
		callNodeSpawn(gain)
	}, [ctx, callNodeSpawn])

	useEffect(() => {
		if (!gainNode || !pIn) return

		pIn.connect(gainNode)
		return () => {
			pIn.disconnect(gainNode)
		}
	}, [gainNode, pIn])

	useEffect(() => {
		if (!gainNode || !pOut) return

		gainNode.connect(pOut)
		return () => {
			gainNode.disconnect()
		}
	}, [gainNode, pOut])

	useEffect(() => {
		if (!gainNode || !ctx) return

		gainNode.gain.setValueAtTime(props.value, ctx.currentTime)
	}, [gainNode, ctx, props.value])

	return <></>
}
