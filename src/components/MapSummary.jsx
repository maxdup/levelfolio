import { useTranslation } from 'react-i18next'

export function MapSummary({ map, 'data-lvl2': lvl2, 'data-lvl3': lvl3 }) {
  const { t } = useTranslation()

  return (
    <div className="box box-main" data-lvl2={lvl2} data-lvl3={lvl3}>
      <div className="install-box">
        <div>
          <div className="blurb">
            <img className="title" src={map.title} alt={map.name} />
            <p>{t(map.name)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
