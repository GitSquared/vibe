import type { OutputAudioComponentProps }  from './audio-nodes/types'
import { useRef, useEffect } from 'react'
import styles from './waveform-graph.module.scss'

export default function WaveformGraph(props: OutputAudioComponentProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvasCtx = canvasRef.current?.getContext('2d')
		if (!canvasCtx || !canvasRef.current) return

		const analyser = props.ctx.createAnalyser()

		analyser.fftSize = 2048
		const waveBuf = new Uint8Array(analyser.frequencyBinCount)

		const { width, height } = canvasRef.current
		canvasCtx.clearRect(0, 0, width, height)

		canvasCtx.fillStyle = '#000'
		canvasCtx.lineWidth = 2
		canvasCtx.strokeStyle = '#eaa377'

		let timerId: number
		const tick = () => {
			analyser.getByteTimeDomainData(waveBuf)

			canvasCtx.fillRect(0, 0, width, height)
			canvasCtx.beginPath()

			const sliceWidth = width / waveBuf.length
			let x = 0
			for (let i = 0; i < waveBuf.length; i++) {
				const v = waveBuf[i] / 128
				const y = v * height / 2

				if (i === 0) {
					canvasCtx.moveTo(x, y)
				} else {
					canvasCtx.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasCtx.lineTo(width, height / 2)
			canvasCtx.stroke()

			timerId = requestAnimationFrame(tick)
		}
		timerId = requestAnimationFrame(tick)

		props.in.connect(analyser)

		return () => {
			cancelAnimationFrame(timerId)
			props.in.disconnect(analyser)
		}
	}, [props.ctx, props.in, canvasRef])

	return <div className={styles.container}>
		<span className={styles.title}>Waveform</span>
		<div className={styles.canvasContainer}>
			<div className={styles.canvasScreen}/>
			<canvas
				ref={canvasRef}
				width={180}
				height={50}
			/>
		</div>
	</div>
}
