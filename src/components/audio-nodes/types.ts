export default interface AudioComponentProps {
	ctx: AudioContext
}

export interface GeneratorAudioComponentProps extends AudioComponentProps {
	out: AudioNode
}

export interface OutputAudioComponentProps extends AudioComponentProps {
	in: AudioNode
}

export interface ProcessorAudioComponentProps extends AudioComponentProps {
	in: AudioNode
	out: AudioNode
}
