import type { MouseEvent as ReactMouseEvent } from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './knob.module.scss'

interface KnobProps {
	value: number
	onChange: (e: number) => void
	min: number
	max: number
	label?: string
	step?: number
}

export default function Knob(props: KnobProps) {
	const [isClick, setIsClick] = useState(false)
	const [tooltip, setTooltip] = useState(false)
	const [curPos, setCurPos] = useState([0, 0])

	const knobRef = useRef<HTMLDivElement>(null)

	const { label, value, min, max, step, onChange } = props

	const handleClick = useCallback((e: MouseEvent | ReactMouseEvent) => {
		let newV = value

		if (e.button === 0) {
			// left click
			newV += (step ?? 1)
		} else if (e.button === 2) {
			// right click
			newV -= (step ?? 1)
		}

		if (newV > max) newV = max
		if (newV < min) newV = min

		onChange(Math.round(newV * 100) / 100)
	}, [onChange, value, max, min, step])

	const handleDrag = useCallback((e: MouseEvent | ReactMouseEvent) => {
		setCurPos([e.clientX, e.clientY])

		const m = e.movementX
		if (m === 0) return

		let newV = value + m * (step ?? 1)

		if (newV > max) newV = max
		if (newV < min) newV = min

		onChange(Math.round(newV * 100) / 100)
	}, [onChange, value, max, min, step])

	useEffect(() => {
		if (!tooltip) return

		document.body.addEventListener('mousemove', handleDrag)

		return () => {
			document.body.removeEventListener('mousemove', handleDrag)
		}
	}, [tooltip, handleDrag])

	useEffect(() => {
		if (!knobRef.current) return

		const knob = knobRef.current

		const disableMenu = (e: MouseEvent) => {
			e.preventDefault()
		}
		knob.addEventListener('contextmenu', disableMenu)

		return () => {
			knob?.removeEventListener('contextmenu', disableMenu)
		}
	}, [knobRef])

	return <div className={styles.container} ref={knobRef}>
		<svg className={styles.valueMeter} viewBox="-6.4 -6.4 12.8 12.8">
			<path
				style={{
					strokeDashoffset: `${(1 - (props.value - props.min) / (props.max - props.min)) * 240}%`
				}}
				d="M -5 4 a 6.4 6.4 0 0 1 0.5 -8.5 a 6.4 6.4 0 0 1 9 0 a 6.4 6.4 0 0 1 0.5 8.5"
			/>
		</svg>
		<div
			className={styles.knob}
			style={{
				transform: `rotate(${-140 + (props.value - props.min) / (props.max - props.min) * 280}deg)`
			}}
			onMouseDown={e => {
				setIsClick(true)
				window.setTimeout(() => {
					setIsClick(false)
				}, 100)
				setTooltip(true)
				handleDrag(e)
			}}
		/>
		{label &&
			<span>{label}</span>
		}

		{tooltip &&
			<div
				className={styles.tooltip}
				style={{
					left: curPos[0] - 20,
					top: curPos[1] - 20
				}}
				onMouseUp={e => {
					if (isClick) {
						handleClick(e)
						window.setTimeout(() => {
							setTooltip(false)
						}, 100)
					} else {
						setTooltip(false)
					}
				}}
			>
				<span>{value}</span>
			</div>
		}

	</div>
}
