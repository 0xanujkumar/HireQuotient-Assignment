import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {TableBody, TableSortLabel,TableCell, TableRow,TableHead, Table, Paper, TableContainer, Typography, Accordion, AccordionDetails, AccordionSummary} from '@material-ui/core';


const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://canopy-frontend-task.now.sh/api/holdings');
      setHoldings(response.data.payload);
    };

    fetchData();
  }, []);

  const groupHoldingsByClass = (holdings) => {
    const groupedHoldings = holdings.reduce((groups, holding) => {
      const assetClass = holding.asset_class;
      groups[assetClass] = groups[assetClass] || [];
      groups[assetClass].push(holding);
      return groups;
    }, {});
    return Object.entries(groupedHoldings);
  };

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <TableSortLabel>Name of the Holding</TableSortLabel>
        </TableCell>
        <TableCell>Ticker</TableCell>
        <TableCell>Asset Class</TableCell>
        <TableCell>Average Price</TableCell>
        <TableCell>Market Price</TableCell>
        <TableCell>Latest Change Percentage</TableCell>
        <TableCell>Market Value in Base CCY</TableCell>
      </TableRow>
    </TableHead>
  );

  const renderHoldingRow = (holding) =>  (
    
    <TableRow key={holding.name}>
      <TableCell>{holding.name}</TableCell>
      <TableCell>{holding.ticker}</TableCell>
      <TableCell>{holding.asset_class}</TableCell>
      <TableCell>{(holding.avg_price)}</TableCell>
      <TableCell>{(holding.market_price)}</TableCell>
      <TableCell>{holding.latest_chg_pct.toFixed(2)}%</TableCell>
      <TableCell>{holding.market_value_ccy.toFixed(2)}</TableCell>
    </TableRow>
  );

  const renderGroupedHoldings = (groupedData) => {
    return groupedData.map(([assetClass, holdingsData]) => (
      <Accordion key={assetClass}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{assetClass}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="holdings table">
              {renderTableHeader()}
              <TableBody>
                {holdingsData.map(renderHoldingRow)}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <div>
      {holdings.length > 0 && renderGroupedHoldings(groupHoldingsByClass(holdings))}
    </div>
  );
};

export default HoldingsTable;