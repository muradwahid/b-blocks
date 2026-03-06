const colors = ['rgba(230, 244, 255, 1)', 'rgba(230, 227, 255, 1)', 'rgba(230, 252, 255, 1)']

export const template = colors.map((color, index) => { 
  return [
    'b-blocks/container',
    {
      advanced: {
        dimension: {
          padding: {
            desktop: {
              top: '45px',
              right: '45px',
              bottom: '45px',
              left: '45px'
            }
          }
        },
        background: {
          normal: {
            type: 'color',
            color
          }
        },
        borderShadow: {
          normal: {
            radius: {
              top: '15px',
              right: '15px',
              bottom: '15px',
              left: '15px'
            }
          }
        }
      },
      className: 'bBlocksStackedSingleCard'
    },
    [
      [
        'b-blocks/section-heading',
        {
          textAlign: 'center',
          title: `Card Item #${index + 1}`,
          titleTypo: {
            fontSize: {
              desktop: '40px',
              tablet: '',
              mobile: ''
            },
            fontWeight: 600
          },
          titleMargin: {
            side: 4,
            bottom: '20px'
          },
          isSep: false,
          desc: 'Insert your own content to showcase or highlight<br> the feature you want to represent. Add any <br>blocks you want to customize it as per<br> your preference.',
          descTypo: {
            fontSize: {
              desktop: '20px'
            },
            fontWeight: 500,
            fontVariant: '500'
          },
          descColor: 'rgba(0, 0, 0, 1)'
        }
      ]
    ]
  ]
})
