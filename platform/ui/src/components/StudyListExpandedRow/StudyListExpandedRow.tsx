import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Table, TableHead, TableBody, TableRow, TableCell } from '../';

import { Portal } from 'react-portal';
import { Dialog, Button } from '@ohif/ui';
import QRCode from 'qrcode';

const viewerURL = 'https://viewer.drvetpacs.info/local';
const viewerQRcode =
  'data:image/png;base64,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';

async function getPacsURL(studyInstanceUid) {
  // const res = await fetch('http://192.168.1.177/pacs/tools/find', {
  const res = await fetch(location.origin + '/pacs/tools/find', {
    method: 'POST',
    body: JSON.stringify({
      Level: 'Study',
      Expand: true,
      Limit: 1,
      Query: {
        StudyInstanceUID: studyInstanceUid,
      },
      RequestedTags: ['ModalitiesInStudy'],
    }),
  });

  const data = await res.json();

  return data;
}

async function getCloudURL(pacsURL, pacsFileName) {
  const formData = new FormData();
  formData.set('pacsUrl', pacsURL);
  formData.set('pacsFileName', pacsFileName);

  const res = await fetch(
    // 'http://35.229.210.192:8080/cloudstorage/animalhospital/transferpacs',
    'https://transfer.drvetpacs.info/cloudstorage/animalhospital/transferpacs',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();

  return data;
}

function QRcodeDialog({ open, qrCode, rawUrl, onClose }) {
  return (
    open && (
      <Portal>
        <div
          className="fixed w-full h-full top-0 z-50 flex justify-center items-center"
          style={{ background: '#000000CC' }}
        >
          <div style={{ width: '800px' }}>
            <Dialog
              title="QRCODE"
              onClose={onClose}
              onSubmit={e => e.preventDefault()}
              body={() => (
                <div>
                  <div className="flex justify-around items-center my-2">
                    <div className="w-72">
                      <p className="text-white text-center text-3xl">
                        DICOM 影像
                      </p>
                      <a href={rawUrl} target="_blank" download>
                        <img className="w-full" src={qrCode} />
                      </a>
                    </div>
                    <div className="w-72">
                      <p className="text-white text-center text-3xl">
                        VIEWER 瀏覽器
                      </p>
                      <a href={viewerURL} target="_blank">
                        <img className="w-full" src={viewerQRcode} />
                      </a>
                    </div>
                  </div>
                  <p className="text-center text-white">
                    提醒 1 :
                    您的檔案只會在本機電腦瀏覽器處理，沒有上傳至任何影像伺服器
                  </p>
                  <p className="text-center text-white">
                    提醒 2 :
                    影像瀏覽器只支援X光檔案，動態影像請使用其他瀏覽器，Ex:RadiAnt
                  </p>
                  <p className="text-center text-white">
                    提醒 3 : QRCODE 可供拍照保存，DICOM 影像連結有時效性 (七天)
                  </p>
                </div>
              )}
            />
          </div>
        </div>
      </Portal>
    )
  );
}

const StudyListExpandedRow = ({
  studyInstanceUid,
  seriesTableColumns,
  seriesTableDataSource,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [rawUrl, setRawUrl] = React.useState(null);
  const [qrCode, setQRCode] = React.useState(null);
  const { t } = useTranslation('StudyList');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const data = await getPacsURL(studyInstanceUid);
        const item = data[0];
        const raw = location.origin + '/pacs/studies/' + item.ID + '/archive';
        // const raw =
        // 'http://192.168.1.177' + '/pacs/studies/' + item.ID + '/archive';
        const { ResultURL } = await getCloudURL(raw, item.ID);
        const url = await QRCode.toDataURL(ResultURL);

        setQRCode(url);
        setRawUrl(ResultURL);
      } catch (err) {
        console.error(err);
      }
    };

    if (window.location) {
      generateQR();
    }
  }, []);

  return (
    <div className="relative w-full bg-black py-4 pl-12 pr-2">
      <div
        className="absolute flex"
        style={{
          top: '1rem',
          right: '1rem',
          gap: 4,
          opacity: rawUrl && qrCode ? 1 : 0.5,
        }}
      >
        <a href={rawUrl}>
          <Button disabled={!rawUrl}>下載</Button>
        </a>
        <Button onClick={() => setOpen(true)} disabled={!qrCode}>
          QRCODE
        </Button>
      </div>
      <QRcodeDialog
        open={open}
        qrCode={qrCode}
        rawUrl={rawUrl}
        onClose={() => setOpen(false)}
      />
      <div className="block">{children}</div>
      <div className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(seriesTableColumns).map(columnKey => {
                return (
                  <TableCell key={columnKey}>
                    {t(seriesTableColumns[columnKey])}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {seriesTableDataSource.map((row, i) => (
              <TableRow key={i}>
                {Object.keys(row).map(cellKey => {
                  const content = row[cellKey];
                  return (
                    <TableCell key={cellKey} className="truncate">
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

StudyListExpandedRow.propTypes = {
  seriesTableDataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  seriesTableColumns: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default StudyListExpandedRow;
