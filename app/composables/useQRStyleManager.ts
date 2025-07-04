import type { QRStyleOptions } from '@@/schemas/qr-style'
import type { QRComponentType, QRStyleProperty } from '@/types/qr-style-editor'
import { computed, reactive } from 'vue'

// Internal type for required QR style options with proper component overrides
type RequiredQRStyleOptions = NonNullable<QRStyleOptions> & {
  componentOverrides: {
    dots: Record<string, any>
    cornerSquares: Record<string, any>
    cornerDots: Record<string, any>
  }
}

export function useQRStyleManager(initialOptions?: Partial<RequiredQRStyleOptions>) {
  // Default QR style options with base style support
  const defaultStyleOptions: RequiredQRStyleOptions = {
    // Base style options that apply to all components
    baseOptions: {
      color: '#000000',
      type: 'square',
    },
    // Individual component overrides
    componentOverrides: {
      dots: {},
      cornerSquares: {},
      cornerDots: {},
    },
    // Legacy component options (maintained for backward compatibility)
    dotsOptions: {
      color: '#000000',
      type: 'square',
      roundSize: true,
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square',
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 2,
    },
    logoSelection: {
      logoType: 'favicon',
      selectedLogoId: undefined,
    },
  }

  // Initialize style options with backward compatibility support
  function initializeStyleOptions(initialOptions?: Partial<RequiredQRStyleOptions>): RequiredQRStyleOptions {
    const options = { ...defaultStyleOptions }

    if (initialOptions) {
      // If initialOptions has new baseOptions structure, use it
      if (initialOptions.baseOptions) {
        Object.assign(options, initialOptions)
      }
      else {
        // Backward compatibility: convert legacy format
        if (initialOptions.dotsOptions) {
          options.dotsOptions = { ...options.dotsOptions, ...initialOptions.dotsOptions }
        }
        if (initialOptions.backgroundOptions) {
          options.backgroundOptions = { ...options.backgroundOptions, ...initialOptions.backgroundOptions }
        }
        if (initialOptions.cornersSquareOptions) {
          options.cornersSquareOptions = { ...options.cornersSquareOptions, ...initialOptions.cornersSquareOptions }
        }
        if (initialOptions.cornersDotOptions) {
          options.cornersDotOptions = { ...options.cornersDotOptions, ...initialOptions.cornersDotOptions }
        }
        if (initialOptions.imageOptions) {
          options.imageOptions = { ...options.imageOptions, ...initialOptions.imageOptions }
        }
      }

      // Initialize logo selection from existing options or defaults
      if (initialOptions.logoSelection) {
        options.logoSelection = { ...options.logoSelection, ...initialOptions.logoSelection }
      }
    }

    return options
  }

  // Style options reactive object
  const styleOptions: RequiredQRStyleOptions = reactive(initializeStyleOptions(initialOptions))

  // Base style management functions
  function isUsingBaseStyle(component: QRComponentType, property: QRStyleProperty): boolean {
    return !styleOptions.componentOverrides[component]
      || !(property in styleOptions.componentOverrides[component])
  }

  function markAsCustomized(component: QRComponentType, property: QRStyleProperty, value: any): void {
    if (!styleOptions.componentOverrides[component]) {
      styleOptions.componentOverrides[component] = {}
    }
    styleOptions.componentOverrides[component][property] = value
  }

  function applyBaseStyle(component: QRComponentType, property: QRStyleProperty): void {
    const effectiveValue = getEffectiveValue(component, property)

    if (component === 'dots' && property === 'color') {
      styleOptions.dotsOptions.color = effectiveValue
      delete styleOptions.componentOverrides.dots.color
    }
    else if (component === 'dots' && property === 'type') {
      styleOptions.dotsOptions.type = effectiveValue as 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
      delete styleOptions.componentOverrides.dots.type
    }
    else if (component === 'cornerSquares' && property === 'color') {
      styleOptions.cornersSquareOptions.color = effectiveValue
      delete styleOptions.componentOverrides.cornerSquares.color
    }
    else if (component === 'cornerSquares' && property === 'type') {
      styleOptions.cornersSquareOptions.type = effectiveValue as 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded'
      delete styleOptions.componentOverrides.cornerSquares.type
    }
    else if (component === 'cornerDots' && property === 'color') {
      styleOptions.cornersDotOptions.color = effectiveValue
      delete styleOptions.componentOverrides.cornerDots.color
    }
    else if (component === 'cornerDots' && property === 'type') {
      styleOptions.cornersDotOptions.type = effectiveValue as 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'
      delete styleOptions.componentOverrides.cornerDots.type
    }
  }

  function resetToBaseStyle(component: QRComponentType, property: QRStyleProperty): void {
    if (styleOptions.componentOverrides[component]) {
      delete styleOptions.componentOverrides[component][property]
      // If no overrides left, remove the component override object
      if (Object.keys(styleOptions.componentOverrides[component]).length === 0) {
        delete styleOptions.componentOverrides[component]
      }
    }
    applyBaseStyle(component, property)
  }

  function getEffectiveValue(component: QRComponentType, property: QRStyleProperty): string {
    if (isUsingBaseStyle(component, property)) {
      if (property === 'color') {
        return styleOptions.baseOptions.color
      }
      else {
        return styleOptions.baseOptions.type
      }
    }

    switch (component) {
      case 'dots':
        if (property === 'color') {
          return styleOptions.dotsOptions.color
        }
        else {
          return styleOptions.dotsOptions.type
        }
      case 'cornerSquares':
        if (property === 'color') {
          return styleOptions.cornersSquareOptions.color
        }
        else {
          return styleOptions.cornersSquareOptions.type || 'square'
        }
      case 'cornerDots':
        if (property === 'color') {
          return styleOptions.cornersDotOptions.color
        }
        else {
          return styleOptions.cornersDotOptions.type || 'square'
        }
      default:
        if (property === 'color') {
          return styleOptions.baseOptions.color
        }
        else {
          return styleOptions.baseOptions.type
        }
    }
  }

  // Computed properties for effective styles
  const effectiveDotsColor = computed(() => getEffectiveValue('dots', 'color'))
  const effectiveDotsType = computed(() => getEffectiveValue('dots', 'type'))
  const effectiveCornerSquareColor = computed(() => getEffectiveValue('cornerSquares', 'color'))
  const effectiveCornerSquareType = computed(() => getEffectiveValue('cornerSquares', 'type'))
  const effectiveCornerDotColor = computed(() => getEffectiveValue('cornerDots', 'color'))
  const effectiveCornerDotType = computed(() => getEffectiveValue('cornerDots', 'type'))

  // Individual component change handlers
  function handleDotsColorChange(newColor: string): void {
    styleOptions.dotsOptions.color = newColor
    markAsCustomized('dots', 'color', newColor)
  }

  function handleDotsTypeChange(newType: string): void {
    styleOptions.dotsOptions.type = newType as any
    markAsCustomized('dots', 'type', newType)
  }

  function handleCornerSquareColorChange(newColor: string): void {
    styleOptions.cornersSquareOptions.color = newColor
    markAsCustomized('cornerSquares', 'color', newColor)
  }

  function handleCornerSquareTypeChange(newType: string): void {
    styleOptions.cornersSquareOptions.type = newType as any
    markAsCustomized('cornerSquares', 'type', newType)
  }

  function handleCornerDotColorChange(newColor: string): void {
    styleOptions.cornersDotOptions.color = newColor
    markAsCustomized('cornerDots', 'color', newColor)
  }

  function handleCornerDotTypeChange(newType: string): void {
    styleOptions.cornersDotOptions.type = newType as any
    markAsCustomized('cornerDots', 'type', newType)
  }

  // Base style change handlers
  function handleBaseColorChange(newColor: string): void {
    styleOptions.baseOptions.color = newColor
    // Update all non-customized components
    if (isUsingBaseStyle('dots', 'color')) {
      styleOptions.dotsOptions.color = newColor
    }
    if (isUsingBaseStyle('cornerSquares', 'color')) {
      styleOptions.cornersSquareOptions.color = newColor
    }
    if (isUsingBaseStyle('cornerDots', 'color')) {
      styleOptions.cornersDotOptions.color = newColor
    }
  }

  function handleBaseTypeChange(newType: string): void {
    styleOptions.baseOptions.type = newType as any
    // Update all non-customized components
    if (isUsingBaseStyle('dots', 'type')) {
      styleOptions.dotsOptions.type = newType as any
    }
    if (isUsingBaseStyle('cornerSquares', 'type')) {
      styleOptions.cornersSquareOptions.type = newType as any
    }
    if (isUsingBaseStyle('cornerDots', 'type')) {
      styleOptions.cornersDotOptions.type = newType as any
    }
  }

  // Logo selection handlers
  function handleLogoTypeChange(newType: string): void {
    styleOptions.logoSelection.logoType = newType as any
    // Clear selected logo when switching to favicon or none
    if (newType === 'favicon' || newType === 'none') {
      styleOptions.logoSelection.selectedLogoId = undefined
    }
  }

  function handleLogoIdChange(logoId: string): void {
    styleOptions.logoSelection.selectedLogoId = logoId
  }

  function resetToDefaults(): void {
    Object.assign(styleOptions, defaultStyleOptions)
    // Clear all component overrides
    styleOptions.componentOverrides = {
      dots: {},
      cornerSquares: {},
      cornerDots: {},
    }
  }

  function getCleanStyleOptions(): QRStyleOptions {
    return {
      // Include base options
      baseOptions: {
        color: styleOptions.baseOptions.color || '#000000',
        type: styleOptions.baseOptions.type || 'square',
      },
      componentOverrides: styleOptions.componentOverrides || {},
      // Legacy component options for backward compatibility
      dotsOptions: {
        color: effectiveDotsColor.value || '#000000',
        type: (effectiveDotsType.value || 'square') as any,
        roundSize: styleOptions.dotsOptions.roundSize ?? true,
      },
      cornersSquareOptions: {
        color: effectiveCornerSquareColor.value || '#000000',
        type: (effectiveCornerSquareType.value || 'square') as any,
      },
      cornersDotOptions: {
        color: effectiveCornerDotColor.value || '#000000',
        type: (effectiveCornerDotType.value || 'square') as any,
      },
      backgroundOptions: {
        color: styleOptions.backgroundOptions.color || '#ffffff',
      },
      imageOptions: {
        hideBackgroundDots: styleOptions.imageOptions.hideBackgroundDots ?? true,
        imageSize: styleOptions.imageOptions.imageSize ?? 0.4,
        margin: styleOptions.imageOptions.margin ?? 2,
      },
      logoSelection: {
        logoType: styleOptions.logoSelection.logoType || 'favicon',
        selectedLogoId: styleOptions.logoSelection.selectedLogoId,
      },
    }
  }

  return {
    styleOptions,
    // Computed properties
    effectiveDotsColor,
    effectiveDotsType,
    effectiveCornerSquareColor,
    effectiveCornerSquareType,
    effectiveCornerDotColor,
    effectiveCornerDotType,
    // Style management functions
    isUsingBaseStyle,
    resetToBaseStyle,
    resetToDefaults,
    getCleanStyleOptions,
    // Change handlers
    handleDotsColorChange,
    handleDotsTypeChange,
    handleCornerSquareColorChange,
    handleCornerSquareTypeChange,
    handleCornerDotColorChange,
    handleCornerDotTypeChange,
    handleBaseColorChange,
    handleBaseTypeChange,
    handleLogoTypeChange,
    handleLogoIdChange,
  }
}
