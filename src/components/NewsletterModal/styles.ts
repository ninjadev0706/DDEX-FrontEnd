import { ThemeUIStyleObject } from 'theme-ui'

export const modalProps = {
  sx: {
    minWidth: ['90%', '50%', '800px'],
    width: ['200px'],
    maxWidth: '800px',
    height: ['500px', '500px', 'auto'],
  },
}

export const internalStyles: Record<string, ThemeUIStyleObject> = {
  modalBody: {
    marginTop: '30px',
    flexDirection: ['column', 'column', 'row'],
    width: '100%',
    justifyContent: ['flex-start', 'flex-start', 'space-between'],
  },
  showApe: {
    alignSelf: ['center', 'center', ''],
    width: ['230px', '230px', '46%'],
    height: ['230px', '230px', '400px'],
    marginTop: '-20px',
    background: `url(images/marketing-modals/emailApe.svg)`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
}
