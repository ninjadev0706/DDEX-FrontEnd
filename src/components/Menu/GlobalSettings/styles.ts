import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  switch: {
    borderRadius: '8px',
    backgroundColor: 'white3',
    'input:checked ~ &': {
      backgroundColor: 'yellow',
    },
  },
}
