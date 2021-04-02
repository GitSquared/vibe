import type { ProcessorAudioComponentProps } from './types'
import { useState, useContext, useCallback, useEffect } from 'react'
import { AudioReactContext } from './audio-context'

export default function Analyser(props: ProcessorAudioComponentProps) {
	const [node, setNode] = useState<AnalyserNode | null>(null)

	const ctx = useContext(AudioReactContext)

	const { in: pIn, out: pOut, onNodeSpawn } = props

	const callNodeSpawn = useCallback((node: AudioNode) => {
		if (typeof onNodeSpawn === 'function') onNodeSpawn(node)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		if (!ctx) return

		const analyser = ctx.createAnalyser()
		analyser.fftSize = 2048

		setNode(analyser)
		callNodeSpawn(analyser)
	}, [ctx, callNodeSpawn])

	useEffect(() => {
		if (!node || !pIn) return

		pIn.connect(node)
		return () => {
			pIn.disconnect(node)
		}
	}, [node, pIn])

	useEffect(() => {
		if (!node || !pOut) return

		node.connect(pOut)
		return () => {
			node.disconnect()
		}
	}, [node, pOut])

	return <></>
}
