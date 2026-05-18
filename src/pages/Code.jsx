import { useTranslation } from 'react-i18next'
import IsotopeGrid from '../components/IsotopeGrid'
import { LvlIcon } from '../components/LvlIcon'
import codeImg from '../images/code/code.jpg'

export function Code() {
  const { t } = useTranslation()

  return (
    <IsotopeGrid id="code">
      <div className="box box-blurb">
        <div className="img-peak">
          <img src={codeImg} alt="" />
        </div>
        <div className="blurb">
          <h2>{t('code-title')}</h2>
          <p>{t('code-intro')}</p>
        </div>
      </div>

      <div className="box box-blurb">
        <div className="blurb">
          <h2>CompilePal</h2>
          <p>{t('code-cpal')}</p>
          <div className="git">
            <a href="https://github.com/ruarai/CompilePal" target="_blank" rel="noreferrer">
              <span>{t('code-git')}</span>
              <LvlIcon name="github" />
            </a>
          </div>
        </div>
      </div>

      <div className="box box-blurb">
        <div className="blurb">
          <h2 className="withsubtext">Vmmc</h2>
          <i className="subtext">{t('code-vmmc-st')}</i>
          <p>{t('code-vmmc')}</p>
          <div className="git">
            <a href="https://github.com/maxdup/VMMC" target="_blank" rel="noreferrer">
              <span>{t('code-git')}</span>
              <LvlIcon name="github" />
            </a>
          </div>
        </div>
      </div>

      <div className="box box-blurb">
        <div className="img-peak-up">
          <img src={codeImg} alt="" />
        </div>
        <div className="blurb">
          <h2>Vradfix</h2>
          <p>{t('code-vrad')}</p>
          <div className="git">
            <a href="https://github.com/maxdup/VRADFix" target="_blank" rel="noreferrer">
              <span>{t('code-git')}</span>
              <LvlIcon name="github" />
            </a>
          </div>
        </div>
      </div>
    </IsotopeGrid>
  )
}
