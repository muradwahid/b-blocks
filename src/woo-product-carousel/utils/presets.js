// What choosing a preset in Layout sets: each preset's whole design, written out. The options
// it lists are the ones its design decides (the rest stay as they are), and what the author wrote (the
// button label, the heading) isn't part of a design, so it's kept.
export const PRESET_STYLES = {
	// Details on hover: block.json's defaults.
	'preset-1': {
		card: {
			desktop: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '1px',
						blur: '3px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.1)',
						isInset: false
					}
				],
				desktop: { radius: { top: '10px', right: '10px', bottom: '10px', left: '10px' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } },
				color: { bg: { type: 'solid', color: '#ffffff' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '12px',
						blur: '24px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.18)',
						isInset: false
					}
				],
				desktop: { radius: { top: '', right: '', bottom: '', left: '' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } }
			}
		},
		content: {
			desktop: {
				align: 'center',
				padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
				gap: '30px',
				space: '20px'
			},
			tablet: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			mobile: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '#f9fafb' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' }
			}
		},
		image: {
			fit: 'cover',
			autoHeight: false,
			desktop: { width: '100%', height: '300px', padding: { top: '', right: '', bottom: '', left: '' } },
			tablet: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			mobile: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { overlay: { type: 'solid', color: 'rgba(15, 23, 42, 0.35)' } }
			}
		},
		title: {
			typo: { fontSize: { desktop: '18px' }, fontWeight: 400, lineHeight: '1.35' },
			desktop: { margin: { top: '0px', right: '0px', bottom: '8px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			normal: { color: { text: '#444ce7' } },
			hover: { color: { text: '#101728' } }
		},
		price: {
			typo: { fontSize: { desktop: '16px' }, fontWeight: 600 },
			saleColor: '#c0362a',
			desktop: { margin: { top: '0px', right: '0px', bottom: '8px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			textColor: '#101728'
		},
		button: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 500 },
			desktop: {
				padding: { top: '16px', right: '12px', bottom: '16px', left: '12px' },
				margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			},
			dividerColor: 'rgba(255, 255, 255, 0.5)'
		},
		viewButton: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 500 },
			desktop: {
				padding: { top: '16px', right: '12px', bottom: '16px', left: '12px' },
				margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			}
		},
		arrow: {
			desktop: { size: '20px', bgSize: '30px', position: '-40px' },
			tablet: { size: '', bgSize: '', position: '' },
			mobile: { size: '', bgSize: '', position: '' },
			normal: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#101728' } } },
			hover: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#444ce7' } } }
		},
		dot: {
			desktop: { size: '15px', gap: '15px', space: '45px' },
			tablet: { size: '', gap: '', space: '' },
			mobile: { size: '', gap: '', space: '' },
			normal: { color: { bg: '#475467' } },
			active: { color: { bg: '#101728' } }
		},
		heading: { typo: { fontSize: { desktop: '22px' }, fontWeight: 600 }, tag: 'h2', textColor: '#1c2839' },
		featured: {
			titleTypo: { fontSize: { desktop: '22px' }, fontWeight: 500, lineHeight: '1.4' },
			priceTypo: { fontSize: { desktop: '20px' }, fontWeight: 700 },
			overlay: { type: 'gradient', gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)' },
			buttonTypo: { fontSize: { desktop: '14px' } },
			desktop: {
				width: '48%',
				height: '372px',
				gap: '30px',
				radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
				padding: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
			},
			tablet: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			button: {
				normal: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '10px', right: '20px', bottom: '10px', left: '24px' },
						radius: { top: '6px', right: '6px', bottom: '6px', left: '6px' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '#252525', bg: { type: 'solid', color: '#ffffff' } }
				},
				hover: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '', bg: {} }
				}
			},
			textColor: '#ffffff'
		},
		options: {
			dots: true,
			equalHeight: true,
			desktop: { slides: 3 },
			tablet: { slides: 2 },
			mobile: { slides: 1 }
		}
	},

	// Centred slider: oval images, the side ones smaller and blurred; the centre product's price and
	// title sit above its image and the cart button, a white pill, below.
	'preset-2': {
		card: {
			desktop: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				desktop: { radius: { top: '0px', right: '0px', bottom: '0px', left: '0px' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				desktop: { radius: { top: '', right: '', bottom: '', left: '' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } }
			}
		},
		content: {
			desktop: {
				align: 'center',
				padding: { top: '10px', right: '10px', bottom: '14px', left: '10px' },
				gap: '30px',
				space: '20px'
			},
			tablet: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			mobile: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '#f9fafb' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' }
			}
		},
		image: {
			fit: 'cover',
			autoHeight: false,
			desktop: { width: '164px', height: '300px', padding: { top: '', right: '', bottom: '', left: '' } },
			tablet: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			mobile: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '50%', right: '50%', bottom: '50%', left: '50%' },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { overlay: { type: 'solid', color: 'rgba(15, 23, 42, 0.35)' } }
			}
		},
		title: {
			typo: { fontSize: { desktop: '20px' }, fontWeight: 600, lineHeight: '1.35' },
			desktop: { margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			normal: { color: { text: '#252525' } },
			hover: { color: { text: '#444ce7' } }
		},
		price: {
			typo: { fontSize: { desktop: '16px' }, fontWeight: 400 },
			saleColor: '#c0362a',
			desktop: { margin: { top: '0px', right: '0px', bottom: '6px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			textColor: '#252525'
		},
		button: {
			typo: { fontSize: { desktop: '16px' }, fontWeight: 400 },
			desktop: {
				padding: { top: '12px', right: '18px', bottom: '12px', left: '18px' },
				margin: { top: '20px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#101728' },
				shadow: [],
				radius: { top: '24px', right: '24px', bottom: '24px', left: '24px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			},
			dividerColor: 'rgba(255, 255, 255, 0.5)'
		},
		viewButton: {
			typo: { fontSize: { desktop: '16px' }, fontWeight: 400 },
			desktop: {
				padding: { top: '12px', right: '18px', bottom: '12px', left: '18px' },
				margin: { top: '20px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#101728' },
				shadow: [],
				radius: { top: '24px', right: '24px', bottom: '24px', left: '24px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			}
		},
		arrow: {
			desktop: { size: '20px', bgSize: '30px', position: '-24px' },
			tablet: { size: '', bgSize: '', position: '' },
			mobile: { size: '', bgSize: '', position: '' },
			normal: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#0433ff' } } },
			hover: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#0329cc' } } }
		},
		dot: {
			desktop: { size: '15px', gap: '15px', space: '20px' },
			tablet: { size: '', gap: '', space: '' },
			mobile: { size: '', gap: '', space: '' },
			normal: { color: { bg: '#475467' } },
			active: { color: { bg: '#101728' } }
		},
		heading: { typo: { fontSize: { desktop: '22px' }, fontWeight: 600 }, tag: 'h2', textColor: '#1c2839' },
		featured: {
			titleTypo: { fontSize: { desktop: '22px' }, fontWeight: 500, lineHeight: '1.4' },
			priceTypo: { fontSize: { desktop: '20px' }, fontWeight: 700 },
			overlay: { type: 'gradient', gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)' },
			buttonTypo: { fontSize: { desktop: '14px' } },
			desktop: {
				width: '48%',
				height: '372px',
				gap: '30px',
				radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
				padding: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
			},
			tablet: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			button: {
				normal: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '10px', right: '20px', bottom: '10px', left: '24px' },
						radius: { top: '6px', right: '6px', bottom: '6px', left: '6px' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '#252525', bg: { type: 'solid', color: '#ffffff' } }
				},
				hover: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '', bg: {} }
				}
			},
			textColor: '#ffffff'
		},
		options: {
			dots: false,
			equalHeight: true,
			desktop: { slides: 3 },
			tablet: { slides: 2 },
			mobile: { slides: 1 }
		}
	},

	// Classic card: the image on top inside the card's padding, a grey box below with the title, price
	// and an outlined pill cart button, all left-aligned; cards keep their own heights.
	'preset-3': {
		card: {
			desktop: {
				padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '1px',
						blur: '3px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.1)',
						isInset: false
					}
				],
				desktop: { radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } },
				color: { bg: { type: 'solid', color: '#ffffff' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '12px',
						blur: '24px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.18)',
						isInset: false
					}
				],
				desktop: { radius: { top: '', right: '', bottom: '', left: '' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } }
			}
		},
		content: {
			desktop: {
				align: 'left',
				padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' },
				gap: '30px',
				space: '20px'
			},
			tablet: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			mobile: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '#f9fafb' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' }
			}
		},
		image: {
			fit: 'cover',
			autoHeight: false,
			desktop: { width: '100%', height: '300px', padding: { top: '', right: '', bottom: '', left: '' } },
			tablet: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			mobile: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { overlay: { type: 'solid', color: 'rgba(15, 23, 42, 0.35)' } }
			}
		},
		title: {
			typo: { fontSize: { desktop: '17px' }, fontWeight: 500, lineHeight: '1.8' },
			desktop: { margin: { top: '0px', right: '0px', bottom: '4px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			normal: { color: { text: '#252525' } },
			hover: { color: { text: '#444ce7' } }
		},
		price: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 700 },
			saleColor: '#c0362a',
			desktop: { margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			textColor: '#252525'
		},
		button: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 400, lineHeight: '1.2' },
			desktop: {
				padding: { top: '12px', right: '26px', bottom: '12px', left: '26px' },
				margin: { top: '20px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#252525' },
				shadow: [],
				radius: { top: '30px', right: '30px', bottom: '30px', left: '30px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			},
			dividerColor: 'rgba(255, 255, 255, 0.5)'
		},
		viewButton: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 400, lineHeight: '1.2' },
			desktop: {
				padding: { top: '12px', right: '26px', bottom: '12px', left: '26px' },
				margin: { top: '20px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#252525' },
				shadow: [],
				radius: { top: '30px', right: '30px', bottom: '30px', left: '30px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			}
		},
		arrow: {
			desktop: { size: '20px', bgSize: '30px', position: '-40px' },
			tablet: { size: '', bgSize: '', position: '' },
			mobile: { size: '', bgSize: '', position: '' },
			normal: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#0433ff' } } },
			hover: { color: { icon: '#ffffff', bg: { type: 'solid', color: '#0329cc' } } }
		},
		dot: {
			desktop: { size: '15px', gap: '15px', space: '45px' },
			tablet: { size: '', gap: '', space: '' },
			mobile: { size: '', gap: '', space: '' },
			normal: { color: { bg: '#475467' } },
			active: { color: { bg: '#101728' } }
		},
		heading: { typo: { fontSize: { desktop: '22px' }, fontWeight: 600 }, tag: 'h2', textColor: '#1c2839' },
		featured: {
			titleTypo: { fontSize: { desktop: '22px' }, fontWeight: 500, lineHeight: '1.4' },
			priceTypo: { fontSize: { desktop: '20px' }, fontWeight: 700 },
			overlay: { type: 'gradient', gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)' },
			buttonTypo: { fontSize: { desktop: '14px' } },
			desktop: {
				width: '48%',
				height: '372px',
				gap: '30px',
				radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
				padding: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
			},
			tablet: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			button: {
				normal: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '10px', right: '20px', bottom: '10px', left: '24px' },
						radius: { top: '6px', right: '6px', bottom: '6px', left: '6px' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '#252525', bg: { type: 'solid', color: '#ffffff' } }
				},
				hover: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '', bg: {} }
				}
			},
			textColor: '#ffffff'
		},
		options: {
			dots: true,
			equalHeight: false,
			desktop: { slides: 3 },
			tablet: { slides: 2 },
			mobile: { slides: 1 }
		}
	},

	// Featured: the first product large on the left (FeaturedCard, styled by the featured attribute), the
	// rest as small white cards in a carousel under a heading, bottom-aligned with it; plain chevrons
	// beside the heading instead of round arrows.
	'preset-4': {
		card: {
			desktop: {
				padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' }
			},
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '1px',
						blur: '3px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.1)',
						isInset: false
					}
				],
				desktop: { radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } },
				color: { bg: { type: 'solid', color: '#ffffff' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [
					{
						hOffset: '0px',
						vOffset: '12px',
						blur: '24px',
						spreed: '0px',
						color: 'rgba(16, 24, 40, 0.18)',
						isInset: false
					}
				],
				desktop: { radius: { top: '', right: '', bottom: '', left: '' } },
				tablet: { radius: { top: '', right: '', bottom: '', left: '' } },
				mobile: { radius: { top: '', right: '', bottom: '', left: '' } }
			}
		},
		content: {
			desktop: {
				align: 'left',
				padding: { top: '10px', right: '0px', bottom: '0px', left: '0px' },
				gap: '30px',
				space: '20px'
			},
			tablet: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			mobile: { align: '', padding: { top: '', right: '', bottom: '', left: '' }, gap: '', space: '' },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' }
			}
		},
		image: {
			fit: 'cover',
			autoHeight: false,
			desktop: { width: '100%', height: '200px', padding: { top: '', right: '', bottom: '', left: '' } },
			tablet: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			mobile: { width: '', height: '', padding: { top: '', right: '', bottom: '', left: '' } },
			normal: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
				color: { bg: { type: 'solid', color: '' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { overlay: { type: 'solid', color: 'rgba(15, 23, 42, 0.35)' } }
			}
		},
		title: {
			typo: { fontSize: { desktop: '16px' }, fontWeight: 500, lineHeight: '1.7' },
			desktop: { margin: { top: '0px', right: '0px', bottom: '2px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			normal: { color: { text: '#252525' } },
			hover: { color: { text: '#444ce7' } }
		},
		price: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 700, lineHeight: '1.7' },
			saleColor: '#c0362a',
			desktop: { margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } },
			tablet: { margin: { top: '', right: '', bottom: '', left: '' } },
			mobile: { margin: { top: '', right: '', bottom: '', left: '' } },
			textColor: '#252525'
		},
		button: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 400, lineHeight: '1.2' },
			desktop: {
				padding: { top: '8px', right: '18px', bottom: '8px', left: '18px' },
				margin: { top: '12px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#606060' },
				shadow: [],
				radius: { top: '25px', right: '25px', bottom: '25px', left: '25px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			},
			dividerColor: 'rgba(255, 255, 255, 0.5)'
		},
		viewButton: {
			typo: { fontSize: { desktop: '14px' }, fontWeight: 400, lineHeight: '1.2' },
			desktop: {
				padding: { top: '8px', right: '18px', bottom: '8px', left: '18px' },
				margin: { top: '12px', right: '0px', bottom: '0px', left: '0px' },
				iconSize: ''
			},
			tablet: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			mobile: {
				padding: { top: '', right: '', bottom: '', left: '' },
				margin: { top: '', right: '', bottom: '', left: '' },
				iconSize: ''
			},
			normal: {
				border: { width: '1px', style: 'solid', color: '#606060' },
				shadow: [],
				radius: { top: '25px', right: '25px', bottom: '25px', left: '25px' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#101728' } }
			},
			hover: {
				border: { width: '', style: 'solid', color: '' },
				shadow: [],
				radius: { top: '', right: '', bottom: '', left: '' },
				color: { text: '#ffffff', bg: { type: 'solid', color: '#146EF5' } }
			}
		},
		arrow: {
			desktop: { size: '22px', bgSize: '30px', position: '' },
			tablet: { size: '', bgSize: '', position: '' },
			mobile: { size: '', bgSize: '', position: '' },
			normal: { color: { icon: '#252525', bg: { type: 'solid', color: '' } } },
			hover: { color: { icon: '#444ce7', bg: { type: 'solid', color: '' } } }
		},
		dot: {
			desktop: { size: '15px', gap: '15px', space: '20px' },
			tablet: { size: '', gap: '', space: '' },
			mobile: { size: '', gap: '', space: '' },
			normal: { color: { bg: '#475467' } },
			active: { color: { bg: '#101728' } }
		},
		heading: { typo: { fontSize: { desktop: '22px' }, fontWeight: 600 }, tag: 'h2', textColor: '#1c2839' },
		featured: {
			titleTypo: { fontSize: { desktop: '22px' }, fontWeight: 500, lineHeight: '1.4' },
			priceTypo: { fontSize: { desktop: '20px' }, fontWeight: 700 },
			overlay: { type: 'gradient', gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)' },
			buttonTypo: { fontSize: { desktop: '14px' } },
			desktop: {
				width: '48%',
				height: '372px',
				gap: '30px',
				radius: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
				padding: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
			},
			tablet: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			mobile: {
				width: '',
				height: '',
				gap: '',
				radius: { top: '', right: '', bottom: '', left: '' },
				padding: { top: '', right: '', bottom: '', left: '' }
			},
			button: {
				normal: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '10px', right: '20px', bottom: '10px', left: '24px' },
						radius: { top: '6px', right: '6px', bottom: '6px', left: '6px' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '#252525', bg: { type: 'solid', color: '#ffffff' } }
				},
				hover: {
					border: { width: '', style: 'solid', color: '' },
					desktop: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					tablet: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					mobile: {
						padding: { top: '', right: '', bottom: '', left: '' },
						radius: { top: '', right: '', bottom: '', left: '' }
					},
					color: { text: '', bg: {} }
				}
			},
			textColor: '#ffffff'
		},
		options: {
			dots: false,
			equalHeight: false,
			desktop: { slides: 2 },
			tablet: { slides: 2 },
			mobile: { slides: 1 }
		}
	}
};
