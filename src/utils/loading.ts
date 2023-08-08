import ora from 'ora'

function useOraLoading(text?: string) {
  const spinner = ora(text || 'AI is thinking...')

  return {
    startLoading: () => spinner.start(),
    stopLoading: () => spinner.stop(),
    succeedLoading: () => spinner.succeed(),
    failLoading: () => spinner.fail(),
  }
}

export default useOraLoading
