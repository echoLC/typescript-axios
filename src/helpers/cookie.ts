const cookie = {
  read (name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  },

  set (key: string, value: string): void {
    document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }
}

export default cookie