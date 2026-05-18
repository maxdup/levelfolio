import { useTranslation } from 'react-i18next'
import IsotopeGrid from '../components/IsotopeGrid'
import { LvlIcon } from '../components/LvlIcon'
import gramfolio from '../images/contact/gramfolio.jpg'
import iconsCv from '../images/icons/icons-cv.png'

export function Contact() {
  const { t } = useTranslation()

  return (
    <IsotopeGrid id="contact">
      <div className="box box-photo" data-lvl2={1} data-lvl3={1}>
        <img src={gramfolio} alt="" />
      </div>

      <div className="box box-w2" data-lvl2={2} data-lvl3={2}>
        <h2>{t('contact')}</h2>
        <p>
          {t('contactblurb')}<br />
          <i className="subtext">{t('contacttrue')}</i>
        </p>
      </div>

      <div className="box links" data-lvl2={3} data-lvl3={3}>
        <h5>{t('findme')}</h5>
        <ul>
          <li>
            <a href="https://github.com/maxdup" target="_blank" rel="noreferrer" title={t('contact-github')}>
              <LvlIcon name="github" />
              <span>Github</span>
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/mdupuis" target="_blank" rel="noreferrer" title={t('contact-facebook')}>
              <LvlIcon name="facebook" />
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UCAWEmDvCDg7X-3AHJdpQqUQ" target="_blank" rel="noreferrer" title={t('contact-youtube')}>
              <LvlIcon name="youtube" />
              <span>Youtube</span>
            </a>
          </li>
          <li>
            <a href="http://ca.linkedin.com/pub/maxime-dupuis/72/560/b11" target="_blank" rel="noreferrer" title={t('contact-linkedin')}>
              <LvlIcon name="linkedin" />
              <span>Linkedin</span>
            </a>
          </li>
        </ul>
      </div>

      <a className="box box-h12" target="_blank" rel="noreferrer"
         data-lvl2={5} data-lvl3={4}
         href="/static/maximedupuis-leveldesigner.pdf"
         title={t('cv-title')}>
        <h5>{t('cv')}</h5>
        <img style={{ height: '200px' }} src={iconsCv} alt="" />
      </a>

      <div className="box box-h2" data-lvl2={4} data-lvl3={5}>
        <h5>{t('contactme')}</h5>
        <ul>
          <li>{t('address')}</li>
          <li>Montréal(Qc) H2E-1C9</li>
          <li><a href="mailto:mdupuis@hotmail.ca">mdupuis@hotmail.ca</a></li>
          <li>(514) 546-0054</li>
          <li><b>{t('languages')}</b></li>
        </ul>
        <h5>{t('status')}</h5>
        <ul>
          <li><b className="available">{t('available')}</b> {t('hire')}</li>
          <li><b className="available">{t('available')}</b> {t('contract')}</li>
        </ul>
      </div>
    </IsotopeGrid>
  )
}
