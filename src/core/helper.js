export const toShortAddress = (source) => {
    if (source.length <= 12) return source
    return '********' + source.substring(source.length - 6, source.length)
}