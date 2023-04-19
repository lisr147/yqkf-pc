<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
export default {
    name: 'SvgIcon',
    props: {
        name: {
            type: String,
            require: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconName() {
            return `#icon-${this.name}`
        },
        svgClass() {
            if (this.className) {
                return `svg-icon${this.className}`
            } else {
                return 'svg-icon'
            }
        },
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
