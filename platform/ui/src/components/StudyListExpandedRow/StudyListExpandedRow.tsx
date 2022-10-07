import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Table, TableHead, TableBody, TableRow, TableCell } from '../';

import { Portal } from 'react-portal';
import { Dialog, Button } from '@ohif/ui';
import QRCode from 'qrcode';

const StudyListExpandedRow = ({
  studyInstanceUid,
  seriesTableColumns,
  seriesTableDataSource,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [qrCode, setQRCode] = React.useState(null);
  const { t } = useTranslation('StudyList');
  console.log(qrCode);
  React.useEffect(() => {
    const generateQR = async () => {
      try {
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
        const item = data[0];

        const url = await QRCode.toDataURL(
          location.origin + '/pacs/studies/' + item.ID + '/archive'
        );
        setQRCode(url);
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
      <Button
        className="absolute"
        onClick={() => setOpen(true)}
        disabled={!qrCode}
        style={{ top: '1rem', right: '1rem' }}
      >
        QRCODE
      </Button>
      {open && (
        <Portal>
          <div
            className="fixed w-full h-full top-0 z-50 flex justify-center items-center"
            style={{ background: '#000000CC' }}
          >
            <div style={{ width: '600px' }}>
              <Dialog
                title="QRCODE"
                onClose={() => setOpen(false)}
                onSubmit={e => e.preventDefault()}
                body={() => (
                  <a href={qrCode} target="_blank" download>
                    <img
                      src={qrCode}
                      style={{ width: '50%', margin: 'auto' }}
                    />
                  </a>
                )}
              />
            </div>
          </div>
        </Portal>
      )}
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
