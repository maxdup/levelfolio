import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IsotopeGrid from '../components/IsotopeGrid'
import vanguardThumb from '../images/vanguard/thumbnail.jpg'
import vanguardTitle from '../images/vanguard/vanguard.png'
import hadalThumb from '../images/hadal/thumbnail.jpg'
import hadalTitle from '../images/hadal/hadal.png'
import snowvilleThumb from '../images/snowville/thumbnail.jpg'
import snowvilleTitle from '../images/snowville/snowville.png'
import occultThumb from '../images/occult/thumbnail.jpg'
import occultTitle from '../images/occult/occult.png'
import effigyThumb from '../images/effigy/thumbnail.jpg'
import effigyTitle from '../images/effigy/effigy.png'

export function Home() {
  const { t } = useTranslation()

  return (
    <IsotopeGrid id="home">
      <div className="box box-blurb">
        <div className="blurb">
          <h2>{t('welcome')}</h2>
          {t('intro')}
        </div>
      </div>

      <Link className="box box-photo" to="/commercial">
        <img src={vanguardThumb} alt="" />
        <img className="title" src={vanguardTitle} alt="Vanguard" />
      </Link>

      <Link className="box box-photo" to="/hobby/hadal">
        <img src={hadalThumb} alt="" />
        <img className="title" src={hadalTitle} alt="Hadal" />
      </Link>

      <Link className="box box-photo" to="/commercial/snowville">
        <img src={snowvilleThumb} alt="" />
        <img className="title" src={snowvilleTitle} alt="Snowville" />
      </Link>

      <Link className="box box-photo" to="/hobby">
        <img src={occultThumb} alt="" />
        <img className="title" src={occultTitle} alt="Occult" />
      </Link>

      <Link className="box box-photo" to="/hobby/effigy">
        <img src={effigyThumb} alt="" />
        <img className="title" src={effigyTitle} alt="Effigy" />
      </Link>
    </IsotopeGrid>
  )
}
