import * as Path from 'path'

import { GitError as DugiteError } from 'dugite'
import { IGitAccount } from '../../models/git-account'

/** Get the environment for authenticating remote operations. */
export function envForAuthentication(auth: IGitAccount | null): Object {
  const env = {
    DESKTOP_PATH: process.execPath,
    DESKTOP_ASKPASS_SCRIPT: getAskPassScriptPath(),
    DESKTOP_IDENTIFIER: 'ASKPASS',
    GIT_ASKPASS: getAskPassTrampolinePath(),
    // supported since Git 2.3, this is used to ensure we never interactively prompt
    // for credentials - even as a fallback
    GIT_TERMINAL_PROMPT: '0',
    GIT_TRACE: localStorage.getItem('git-trace') || '0',
  }

  if (!auth) {
    return env
  }

  return {
    ...env,
    DESKTOP_USERNAME: auth.login,
    DESKTOP_ENDPOINT: auth.endpoint,
  }
}

/** The set of errors which fit under the "authentication failed" umbrella. */
export const AuthenticationErrors: ReadonlySet<DugiteError> = new Set([
  DugiteError.HTTPSAuthenticationFailed,
  DugiteError.SSHAuthenticationFailed,
  DugiteError.HTTPSRepositoryNotFound,
  DugiteError.SSHRepositoryNotFound,
])

function getAskPassTrampolinePath(): string {
  //const extension = __WIN32__ ? 'bat' : 'sh'
  return '/Users/spadrino/Development/GitHub/askpass-trampoline/build/Release/askpass-trampoline' // Path.resolve(__dirname, 'static', `ask-pass-trampoline.${extension}`)
}

function getAskPassScriptPath(): string {
  return Path.resolve(__dirname, 'ask-pass.js')
}
