import type { MouseEvent, TouchEvent } from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { keys as KEYS } from './keyboard.notes.json'
import styles from './keyboard.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface KeyboardProps {
	onKeyPress: (noteFreq: number) => () => void
}

interface KeyProps extends KeyboardProps {
	note: number
	label?: string
	kbdCode?: string
	sharp?: boolean
}

function Key(props: KeyProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [pressed, setPressed] = useState(false)
	const [clearFn, setClearFn] = useState<(() => void) | null>(null)

	const { onKeyPress, note } = props

	const handleDown = useCallback((e: KeyboardEvent | MouseEvent | TouchEvent) => {
		e.preventDefault()
		const fn = onKeyPress(note)
		// Little trick for storing functions in state
		setClearFn(() => () => {
			fn()
		})
		setPressed(true)
	}, [onKeyPress, note])

	const handleUp = useCallback((e: KeyboardEvent | MouseEvent | TouchEvent) => {
		e.preventDefault()
		setPressed(false)
		if (typeof clearFn === 'function') {
			clearFn()
			setClearFn(null)
		}
	}, [clearFn])

	useEffect(() => {
		if (!props.kbdCode) return

		function kbdDown(e: KeyboardEvent) {
			if (e.shiftKey || e.ctrlKey) return
			if (e.code === props.kbdCode && !pressed) {
				handleDown(e)
			}
		}

		function kbdUp(e: KeyboardEvent) {
			if (e.code === props.kbdCode) {
				handleUp(e)
			}
		}

		document.body.addEventListener('keydown', kbdDown)
		document.body.addEventListener('keyup', kbdUp)

		return () => {
			document.body.removeEventListener('keydown', kbdDown)
			document.body.removeEventListener('keyup', kbdUp)
		}
	}, [props.kbdCode, handleDown, handleUp, pressed])

	let label = props.label
	if (!props.label && props.kbdCode) {
		const k = props.kbdCode.replace('Key', '')
		if (k.length === 1) {
			label = k
		}
	}

	return <div
		ref={ref}
		className={cx({
			key: true,
			sharp: props.sharp,
			pressed
		})}
		onMouseDown={handleDown}
		onMouseUp={handleUp}
		onMouseEnter={e => {
			if (e.buttons > 0) handleDown(e)
		}}
		onMouseLeave={handleUp}
		onTouchStart={handleDown}
		onTouchCancel={handleUp}
		onTouchEnd={handleUp}
	>
		{label &&
			<span className={styles.keyLabel}>
				{label}
			</span>
		}
	</div>
}

export default function Keyboard(props: KeyboardProps) {
	const keys = KEYS.map(keyObj => {
		return <Key
			note={keyObj.hz}
			onKeyPress={props.onKeyPress}
			sharp={keyObj.sharp}
			key={keyObj.hz}
			kbdCode={keyObj.kbdCode}
			label={keyObj.label}
		/>
	})

	return <div className={styles.container}>
		{keys}
	</div>
}
