import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<'riskContainer' | 'tag' | 'text' | 'title' | 'yellow', ThemeUIStyleObject> = {
  riskContainer: {
    position: 'relative',
    width: '0',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: '100%',
  },
  tag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3px 8px',
    gap: '5px',
    border: '2px solid',
    borderRadius: '70px',
    height: '21px',
    marginBottom: '10px',
  },
  text: {
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: '15px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    mb: '10px',
  },
  yellow: {
    color: 'yellow',
    textDecoration: 'underline',
    cursor: 'pointer',
    lineHeight: '16px',
  },
}
